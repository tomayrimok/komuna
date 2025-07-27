import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, Brackets } from 'typeorm';
import { GeneralShoppingList } from './general-shopping-list.entity';
import { CreateGeneralShoppingListDto, UpdateGeneralShoppingListDto, GenerateShoppingListFromTemplateDto } from './dto/general-shopping-list.dto';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { NotificationService } from '../notification/notification.service';
import { ContextType, UserRole, Frequency } from '@komuna/types';
import { addDays, addWeeks, addMonths, addYears, startOfDay, format } from 'date-fns';
import { randomUUID } from 'crypto';

@Injectable()
export class GeneralShoppingListService {
    private readonly logger = new Logger(GeneralShoppingListService.name);

    constructor(
        @InjectRepository(GeneralShoppingList)
        private readonly generalShoppingListRepo: Repository<GeneralShoppingList>,
        private readonly shoppingListService: ShoppingListService,
        private readonly notificationService: NotificationService
    ) { }

    async createGeneralShoppingList(dto: CreateGeneralShoppingListDto, userId: string): Promise<GeneralShoppingList> {
        const nextGenerationAt = dto.recurrenceRule && !dto.isManualOnly
            ? this.calculateNextGenerationDate(new Date(), dto.recurrenceRule)
            : null;

        const generalShoppingList = this.generalShoppingListRepo.create({
            ...dto,
            createdByUserId: userId,
            nextGenerationAt
        });

        const savedList = await this.generalShoppingListRepo.save(generalShoppingList);

        // Send notification about new template creation
        try {
            const templateTypeText = dto.isManualOnly ? 'תבנית' : 'תבנית אוטומטית';
            const targetText = dto.targetContextType === ContextType.APARTMENT ? 'משותפת' : 'אישית';

            this.notificationService.sendNotificationToApartment(
                dto.apartmentId,
                {
                    notification: {
                        title: 'תבנית רשימת קניות חדשה',
                        body: `${templateTypeText} ${targetText}: "${dto.title}"`
                    }
                },
                [UserRole.ROOMMATE],
                userId
            );
        } catch (error) {
            console.error('Failed to send general shopping list creation notification:', error);
        }

        return savedList;
    }

    async updateGeneralShoppingList(dto: UpdateGeneralShoppingListDto): Promise<GeneralShoppingList> {
        const existingList = await this.generalShoppingListRepo.findOneBy({
            generalShoppingListId: dto.generalShoppingListId,
        });

        if (!existingList) {
            throw new BadRequestException('General shopping list not found');
        }

        // If recurrence rule changed, recalculate next generation date
        let nextGenerationAt = existingList.nextGenerationAt;
        if (dto.recurrenceRule && JSON.stringify(dto.recurrenceRule) !== JSON.stringify(existingList.recurrenceRule)) {
            nextGenerationAt = dto.isManualOnly ? null : this.calculateNextGenerationDate(new Date(), dto.recurrenceRule);
        } else if (dto.isManualOnly !== undefined && dto.isManualOnly !== existingList.isManualOnly) {
            nextGenerationAt = dto.isManualOnly ? null : this.calculateNextGenerationDate(new Date(), existingList.recurrenceRule);
        }

        const newItems = dto.items?.map((item) => ({
            ...item,
            itemId: item.itemId || randomUUID(),
        }));

        const updatedList = { ...existingList, ...dto, nextGenerationAt, items: newItems };
        const savedList = await this.generalShoppingListRepo.save(updatedList);

        return savedList;
    }

    async getGeneralShoppingLists(apartmentId: string, userId: string): Promise<GeneralShoppingList[]> {
        const qb = this.generalShoppingListRepo.createQueryBuilder('list');

        return qb
            .where('list.apartmentId = :apartmentId', { apartmentId })
            .andWhere(
                new Brackets(qb => {
                    qb.where('list.targetContextType = :apt', { apt: ContextType.APARTMENT })
                        .orWhere(
                            new Brackets(qb2 => {
                                qb2.where('list.targetContextType = :user', { user: ContextType.USER })
                                    .andWhere('list.createdByUserId = :userId', { userId });
                            })
                        );
                })
            )
            .leftJoinAndSelect('list.createdBy', 'createdBy')
            .orderBy('list.createdAt', 'DESC')
            .getMany();
    }


    async getGeneralShoppingListById(generalShoppingListId: string): Promise<GeneralShoppingList | null> {
        return this.generalShoppingListRepo.findOneBy({ generalShoppingListId });
    }

    async deleteGeneralShoppingList(generalShoppingListId: string): Promise<void> {
        await this.generalShoppingListRepo.delete({ generalShoppingListId });
    }

    async duplicateGeneralShoppingList(generalShoppingListId: string, user: any): Promise<GeneralShoppingList> {
        const originalList = await this.getGeneralShoppingListById(generalShoppingListId);
        if (!originalList) {
            throw new BadRequestException('General shopping list not found');
        }

        const duplicateData: Partial<GeneralShoppingList> = {
            apartmentId: originalList.apartmentId,
            title: `${originalList.title} - עותק`,
            description: originalList.description,
            targetContextType: originalList.targetContextType,
            items: originalList.items, // Deep copy the items
            recurrenceRule: originalList.recurrenceRule,
            isActive: false, // Start as inactive
            isManualOnly: originalList.isManualOnly,
            createdByUserId: user.userId,
            lastGeneratedAt: null,
            nextGenerationAt: null,
        };

        const duplicatedList = this.generalShoppingListRepo.create(duplicateData);
        return await this.generalShoppingListRepo.save(duplicatedList);
    }

    // Find all general shopping lists that need to generate new lists
    async getListsToGenerate(): Promise<GeneralShoppingList[]> {
        const now = new Date();
        return this.generalShoppingListRepo.find({
            where: {
                isActive: true,
                isManualOnly: false,
                nextGenerationAt: LessThanOrEqual(now),
            },
        });
    }

    // Generate actual shopping lists from general lists that are due
    async generateShoppingListsFromTemplates(): Promise<void> {
        const generalLists = await this.getListsToGenerate();

        this.logger.log(`Found ${generalLists.length} general shopping lists ready for generation`);

        for (const generalList of generalLists) {
            try {
                await this.generateShoppingListFromTemplate(generalList);
            } catch (error) {
                this.logger.error(`Failed to generate shopping list from template ${generalList.generalShoppingListId}:`, error);
            }
        }
    }

    // Generate a single shopping list from a template (can be called manually or automatically)
    async generateShoppingListFromTemplate(
        generalList: GeneralShoppingList,
        overrideDto?: GenerateShoppingListFromTemplateDto,
        userId?: string
    ): Promise<ContextType> {
        const targetContextType = overrideDto?.targetContextType || generalList.targetContextType;
        const targetUserId = overrideDto?.targetUserId;

        // Add items to the appropriate shopping list
        const contextId = targetContextType === ContextType.APARTMENT
            ? generalList.apartmentId
            : (targetUserId || generalList.createdByUserId);

        for (const item of generalList.items) {
            const shoppingListItem = {
                name: item.name,
                category: item.category || '',
                amount: item.amount,
                isUrgent: item.isUrgent || false,
                image: item.image,
                isPurchased: false,
                creatorId: generalList.createdByUserId,
                createdAt: new Date().toISOString(),
            };

            await this.shoppingListService.addItemToShoppingList(
                targetContextType,
                generalList.apartmentId,
                contextId,
                shoppingListItem
            );
        }

        this.logger.log(`Generated shopping list "${generalList.title}" for ${targetContextType === ContextType.APARTMENT ? 'apartment' : 'user'}`);

        // Update the general list's generation timestamps (only for automatic generation)
        if (!overrideDto && generalList.recurrenceRule && !generalList.isManualOnly) {
            const nextGenerationAt = this.calculateNextGenerationDate(new Date(), generalList.recurrenceRule);
            await this.generalShoppingListRepo.update(generalList.generalShoppingListId, {
                lastGeneratedAt: new Date(),
                nextGenerationAt,
            });
        }

        // Send notification about automatically generated list
        try {
            if (targetContextType === ContextType.USER) return;
            const messageText = overrideDto
                ? `רשימת קניות נוצרה מתבנית: "${generalList.title}"`
                : `רשימת קניות נוצרה אוטומטית מתבנית: "${generalList.title}"`;

            this.notificationService.sendNotificationToApartment(
                generalList.apartmentId,
                {
                    notification: {
                        title: overrideDto ? 'רשימת קניות נוצרה מתבנית' : 'רשימת קניות נוצרה אוטומטית',
                        body: messageText
                    }
                },
                [UserRole.ROOMMATE],
                userId
            );
        } catch (error) {
            console.error('Failed to send shopping list generation notification:', error);
        }

        return targetContextType;
    }

    // Manual generation from template
    async manuallyGenerateFromTemplate(dto: GenerateShoppingListFromTemplateDto, userId: string): Promise<ContextType> {
        const generalList = await this.getGeneralShoppingListById(dto.generalShoppingListId);

        if (!generalList) {
            throw new BadRequestException('General shopping list not found');
        }

        if (!generalList.isActive) {
            throw new BadRequestException('General shopping list is not active');
        }

        return await this.generateShoppingListFromTemplate(generalList, dto, userId);
    }

    // Calculate when the next list should be generated based on recurrence rule
    private calculateNextGenerationDate(baseDate: Date, recurrenceRule: any): Date {
        if (!recurrenceRule) return null;

        const interval = recurrenceRule.interval || 1;

        switch (recurrenceRule.frequency) {
            case Frequency.DAILY:
                return addDays(baseDate, interval);
            case Frequency.WEEKLY:
                return addWeeks(baseDate, interval);
            case Frequency.MONTHLY:
                return addMonths(baseDate, interval);
            case Frequency.YEARLY:
                return addYears(baseDate, interval);
            default:
                return addWeeks(baseDate, 1); // Default to weekly
        }
    }
} 
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual } from 'typeorm';
import { GeneralTask } from './general-task.entity';
import { CreateGeneralTaskDto, UpdateGeneralTaskDto } from './dto/general-task.dto';
import { TaskService } from '../task/task.service';
import { NotificationService } from '../notification/notification.service';
import { Frequency, TaskType, UserRole } from '@komuna/types';
import { addDays, addWeeks, addMonths, addYears, startOfDay, format } from 'date-fns';

@Injectable()
export class GeneralTaskService {
    private readonly logger = new Logger(GeneralTaskService.name);

    constructor(
        @InjectRepository(GeneralTask)
        private readonly generalTaskRepo: Repository<GeneralTask>,
        private readonly taskService: TaskService,
        private readonly notificationService: NotificationService
    ) { }

    async createGeneralTask(dto: CreateGeneralTaskDto, userId: string): Promise<GeneralTask> {
        const nextGenerationAt = this.calculateNextGenerationDate(new Date(), dto.recurrenceRule);

        const generalTask = this.generalTaskRepo.create({
            ...dto,
            createdByUserId: userId,
            nextGenerationAt
        });

        const savedTask = await this.generalTaskRepo.save(generalTask);

        // Send notification about new general task template creation
        try {
            this.notificationService.sendNotificationToApartment(
                dto.apartmentId,
                {
                    notification: {
                        title: 'תבנית משימה חדשה נוצרה',
                        body: dto.title
                    }
                },
                [UserRole.ROOMMATE],
                userId
            );
        } catch (error) {
            console.error('Failed to send general task creation notification:', error);
        }

        return savedTask;
    }

    async updateGeneralTask(dto: UpdateGeneralTaskDto): Promise<GeneralTask> {
        const existingTask = await this.generalTaskRepo.findOneBy({
            generalTaskId: dto.generalTaskId,
        });

        if (!existingTask) {
            throw new BadRequestException('General task not found');
        }

        // If recurrence rule changed, recalculate next generation date
        let nextGenerationAt = existingTask.nextGenerationAt;
        if (dto.recurrenceRule && JSON.stringify(dto.recurrenceRule) !== JSON.stringify(existingTask.recurrenceRule)) {
            nextGenerationAt = this.calculateNextGenerationDate(new Date(), dto.recurrenceRule);
        }

        const updatedTask = { ...existingTask, ...dto, nextGenerationAt };
        const savedTask = await this.generalTaskRepo.save(updatedTask);

        // Send notification about general task template update
        try {
            this.notificationService.sendNotificationToApartment(
                existingTask.apartmentId,
                {
                    notification: {
                        title: 'תבנית משימה עודכנה',
                        body: dto.title
                    }
                },
                [UserRole.ROOMMATE]
            );
        } catch (error) {
            console.error('Failed to send general task update notification:', error);
        }

        return savedTask;
    }

    async getGeneralTasks(apartmentId: string): Promise<GeneralTask[]> {
        return this.generalTaskRepo.find({
            where: { apartmentId },
            order: { createdAt: 'DESC' },
        });
    }

    async getGeneralTaskById(generalTaskId: string): Promise<GeneralTask | null> {
        return this.generalTaskRepo.findOneBy({ generalTaskId });
    }

    async deleteGeneralTask(generalTaskId: string): Promise<void> {
        await this.generalTaskRepo.delete({ generalTaskId });
    }

    //Find all general tasks that need to generate new tasks
    async getTasksToGenerate(): Promise<GeneralTask[]> {
        const now = new Date();
        return this.generalTaskRepo.find({
            where: {
                isActive: true,
                nextGenerationAt: LessThanOrEqual(now),
            },
        });
    }

    //Generate actual tasks from general tasks that are due
    async generateTasksFromGeneralTasks(): Promise<void> {
        const generalTasks = await this.getTasksToGenerate();

        this.logger.log(`Found ${generalTasks.length} general tasks ready for generation`);

        for (const generalTask of generalTasks) {
            try {
                await this.generateTaskFromGeneralTask(generalTask);
            } catch (error) {
                this.logger.error(`Failed to generate task from general task ${generalTask.generalTaskId}:`, error);
            }
        }
    }

    //Generate a single task from a general task
    private async generateTaskFromGeneralTask(generalTask: GeneralTask): Promise<void> {
        const now = new Date();
        const dueDate = this.calculateTaskDueDate(now, generalTask.recurrenceRule);

        // Check if a task with the same title and due date already exists
        const existingTask = await this.taskService.findTaskByTitleAndDate(
            generalTask.apartmentId,
            generalTask.title,
            dueDate
        );

        if (existingTask) {
            this.logger.log(`Task "${generalTask.title}" for ${format(dueDate, 'yyyy-MM-dd')} already exists, skipping`);
        } else {
            // Create the actual task
            await this.taskService.addEditTask({
                title: generalTask.title,
                description: generalTask.description,
                apartmentId: generalTask.apartmentId,
                taskType: generalTask.taskType,
                dueDate,
                dueTime: generalTask.defaultDueTime,
                isRecurrent: false, // Generated tasks are not recurrent themselves
                assignedTo: generalTask.defaultAssignedTo,
            }, generalTask.createdByUserId);

            this.logger.log(`Generated task "${generalTask.title}" for ${format(dueDate, 'yyyy-MM-dd')}`);

            // Send notification about automatically generated task
            try {
                this.notificationService.sendNotificationToApartment(
                    generalTask.apartmentId,
                    {
                        notification: {
                            title: 'משימה חדשה נוצרה אוטומטית',
                            body: `${generalTask.title} - ${format(dueDate, 'dd/MM/yyyy')}`
                        }
                    },
                    [UserRole.ROOMMATE]
                );
            } catch (error) {
                console.error('Failed to send auto-generated task notification:', error);
            }
        }

        // Update the general task's generation timestamps
        const nextGenerationAt = this.calculateNextGenerationDate(now, generalTask.recurrenceRule);
        await this.generalTaskRepo.update(generalTask.generalTaskId, {
            lastGeneratedAt: now,
            nextGenerationAt,
        });
    }

    //Calculate when the next task should be generated based on recurrence rule
    private calculateNextGenerationDate(baseDate: Date, recurrenceRule: any): Date {
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
                return addDays(baseDate, 1);
        }
    }

    //Calculate the due date for the generated task
    private calculateTaskDueDate(baseDate: Date, recurrenceRule: any): Date {
        // For now, tasks are due on the generation date
        return startOfDay(baseDate);
    }
} 
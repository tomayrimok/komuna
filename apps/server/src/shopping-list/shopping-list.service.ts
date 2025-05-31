import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ShoppingList } from './shopping-list.entity';
import { Repository } from 'typeorm';
import { ShoppingListContextType, ShoppingListItemDto } from '@komuna/types';
import { uniqueId } from 'lodash';
import { randomUUID } from 'crypto';

@Injectable()
export class ShoppingListService {

    constructor(
        @InjectRepository(ShoppingList)
        private readonly shoppingListRepository: Repository<ShoppingList>,
    ) { }

    async getApartmentShoppingList(apartmentId: string): Promise<ShoppingList> {
        return this.shoppingListRepository.findOne({ where: { contextType: ShoppingListContextType.APARTMENT, contextId: apartmentId } });
    }

    async getPersonalShoppingList(userId: string): Promise<ShoppingList> {
        return this.shoppingListRepository.findOne({ where: { contextType: ShoppingListContextType.USER, contextId: userId } });
    }

    async addItemToShoppingList(contextType: ShoppingListContextType, apartmentId: string, userId: string, itemData: ShoppingListItemDto): Promise<ShoppingList> {

        const itemDataWithId = {
            ...itemData,
            creatorId: userId,
            itemId: randomUUID(),
        }

        const shoppingList = await this.shoppingListRepository.findOne({ where: { contextType, contextId: contextType === ShoppingListContextType.APARTMENT ? apartmentId : userId } });
        if (!shoppingList) {
            const newShoppingList = this.shoppingListRepository.create({
                contextType,
                contextId: contextType === ShoppingListContextType.APARTMENT ? apartmentId : userId,
                items: [itemDataWithId],
            });
            return await this.shoppingListRepository.save(newShoppingList);
        }

        shoppingList.items.unshift(itemDataWithId);
        return await this.shoppingListRepository.save(shoppingList);
    }

    async removeItemFromShoppingList(contextType: ShoppingListContextType, apartmentId: string, userId: string, itemId: string): Promise<ShoppingList> {
        const shoppingList = await this.shoppingListRepository.findOne({ where: { contextType, contextId: contextType === ShoppingListContextType.APARTMENT ? apartmentId : userId } });
        if (!shoppingList) {
            throw new Error('Shopping list not found');
        }

        shoppingList.items = shoppingList.items.filter(item => item.itemId !== itemId);
        return await this.shoppingListRepository.save(shoppingList);
    }

    async updateItemInShoppingList(contextType: ShoppingListContextType, apartmentId: string, userId: string, itemId: string, itemData: Partial<ShoppingListItemDto>): Promise<ShoppingList> {
        const shoppingList = await this.shoppingListRepository.findOne({ where: { contextType, contextId: contextType === ShoppingListContextType.APARTMENT ? apartmentId : userId } });
        if (!shoppingList) {
            throw new Error('Shopping list not found');
        }

        const itemIndex = shoppingList.items.findIndex(item => item.itemId === itemId);
        if (itemIndex === -1) {
            throw new Error('Item not found');
        }

        shoppingList.items[itemIndex] = { ...shoppingList.items[itemIndex], ...itemData };
        return await this.shoppingListRepository.save(shoppingList);
    }

    async clearShoppingList(contextType: ShoppingListContextType, apartmentId: string, userId: string): Promise<ShoppingList> {
        const shoppingList = await this.shoppingListRepository.findOne({ where: { contextType, contextId: contextType === ShoppingListContextType.APARTMENT ? apartmentId : userId } });
        if (!shoppingList) {
            throw new Error('Shopping list not found');
        }

        shoppingList.items = [];
        return await this.shoppingListRepository.save(shoppingList);
    }

    async markAllItemsAsPurchased(contextType: ShoppingListContextType, apartmentId: string, userId: string): Promise<ShoppingList> {
        const shoppingList = await this.shoppingListRepository.findOne({ where: { contextType, contextId: contextType === ShoppingListContextType.APARTMENT ? apartmentId : userId } });
        if (!shoppingList) {
            throw new Error('Shopping list not found');
        }

        shoppingList.items.forEach(item => item.isPurchased = true);
        return await this.shoppingListRepository.save(shoppingList);
    }

    async changeOrder(contextType: ShoppingListContextType, apartmentId: string, userId: string, itemIds: string[]): Promise<ShoppingList> {
        const shoppingList = await this.shoppingListRepository.findOne({ where: { contextType, contextId: contextType === ShoppingListContextType.APARTMENT ? apartmentId : userId } });
        if (!shoppingList) {
            throw new Error('Shopping list not found');
        }

        const itemsMap = new Map(shoppingList.items.map(item => [item.itemId, item]));
        const itemsNotInList = shoppingList.items.filter(item => !itemIds.includes(item.itemId));
        const orderedItems = itemIds
            .map(itemId => itemsMap.get(itemId))
            .filter((item): item is typeof shoppingList.items[0] => item !== undefined);

        shoppingList.items = [...itemsNotInList, ...orderedItems];

        return this.shoppingListRepository.save(shoppingList);
    }

}

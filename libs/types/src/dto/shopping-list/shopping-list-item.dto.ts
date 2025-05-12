export class ShoppingListItemDto {
    itemId: string;
    name: string;
    isPurchased: boolean;
    image?: string;
    category?: string;
    isUrgent: boolean;
    amount: number;
    creatorId?: string;
    assignedTo?: string;
}
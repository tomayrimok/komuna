import { ApiProperty } from "@nestjs/swagger";


export class BaseShoppingListItemDto {

    @ApiProperty()
    name: string;

    @ApiProperty()
    isPurchased: boolean;

    @ApiProperty({ required: false })
    image?: string;

    @ApiProperty({ required: false })
    category?: string;

    @ApiProperty()
    isUrgent: boolean;

    @ApiProperty()
    amount: number;

    @ApiProperty()
    creatorId: string;
    // assignedTo?: string;

    @ApiProperty()
    createdAt: string;
}
export class ShoppingListItemDto extends BaseShoppingListItemDto {

    @ApiProperty()
    itemId: string;
}

export class NewShoppingListItemDto extends BaseShoppingListItemDto {
    @ApiProperty({ required: false })
    itemId?: string;
}
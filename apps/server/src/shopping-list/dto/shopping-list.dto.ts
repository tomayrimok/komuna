import { ShoppingListContextType } from "@komuna/types";
import { ApiProperty } from "@nestjs/swagger";
import { NewShoppingListItemDto } from "./shopping-list-item.dto";
import { IsEnum, ValidateNested } from "class-validator";
import { Type } from "class-transformer";


export class AddItemDto {
    @ApiProperty({ type: NewShoppingListItemDto })
    @ValidateNested()
    @Type(() => NewShoppingListItemDto)
    itemData: NewShoppingListItemDto;

    @ApiProperty({ enum: ShoppingListContextType })
    @IsEnum(ShoppingListContextType)
    contextType: ShoppingListContextType;
}

export class ClearShoppingListDto {
    @ApiProperty({ enum: ShoppingListContextType })
    contextType: ShoppingListContextType;
}

export class MarkAllAsPurchasedDto {
    @ApiProperty({ enum: ShoppingListContextType })
    contextType: ShoppingListContextType;
}

export class DeleteItemDto {
    @ApiProperty()
    itemId: string;

    @ApiProperty({ enum: ShoppingListContextType })
    contextType: ShoppingListContextType;
}

export class UpdateItemDto {
    @ApiProperty()
    itemId: string;

    @ApiProperty({ type: NewShoppingListItemDto })
    itemData: Partial<NewShoppingListItemDto>;

    @ApiProperty({ enum: ShoppingListContextType })
    contextType: ShoppingListContextType;
}

export class changeOrderDto {
    @ApiProperty({ type: [String] })
    itemIds: string[];

    @ApiProperty({ enum: ShoppingListContextType })
    contextType: ShoppingListContextType;
}
import { ShoppingListContextType } from "@komuna/types";
import { ApiProperty } from "@nestjs/swagger";
import { NewShoppingListItemDto, ShoppingListItemDto } from "./shopping-list-item.dto";
import { IsArray, IsEnum, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

export class EditShoppingListItemDto {
    @ApiProperty({ enum: ShoppingListContextType })
    @IsEnum(ShoppingListContextType)
    contextType: ShoppingListContextType;
}

export class AddItemDto extends EditShoppingListItemDto {
    @ApiProperty({ type: NewShoppingListItemDto })
    @ValidateNested()
    @Type(() => NewShoppingListItemDto)
    itemData: NewShoppingListItemDto;
}

export class ClearShoppingListDto extends EditShoppingListItemDto { }

export class MarkAllAsPurchasedDto extends EditShoppingListItemDto { }

export class DeleteItemDto extends EditShoppingListItemDto {
    @ApiProperty()
    @IsString()
    itemId: string;
}

export class UpdateItemDto extends EditShoppingListItemDto {
    @ApiProperty()
    @IsString()
    itemId: string;

    @ApiProperty({ type: ShoppingListItemDto })
    @ValidateNested()
    @Type(() => ShoppingListItemDto)
    itemData: Partial<ShoppingListItemDto>;

}

export class changeOrderDto extends EditShoppingListItemDto {
    @ApiProperty({ type: [String] })
    @IsArray()
    itemIds: string[];
}
import { ContextType } from "@komuna/types";
import { ApiProperty } from "@nestjs/swagger";
import { NewShoppingListItemDto, ShoppingListItemWithIdDto } from "./shopping-list-item.dto";
import { IsArray, IsEnum, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

export class EditShoppingListItemDto {
    @ApiProperty({ enum: ContextType })
    @IsEnum(ContextType)
    contextType: ContextType;

    @ApiProperty()
    @IsString()
    apartmentId: string;
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

    @ApiProperty({ type: ShoppingListItemWithIdDto })
    @ValidateNested()
    @Type(() => ShoppingListItemWithIdDto)
    itemData: Partial<ShoppingListItemWithIdDto>;

}

export class SyncListDto extends EditShoppingListItemDto {
    @ApiProperty({ type: [ShoppingListItemWithIdDto] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ShoppingListItemWithIdDto)
    items: ShoppingListItemWithIdDto[];
}

export class changeOrderDto extends EditShoppingListItemDto {
    @ApiProperty({ type: [String] })
    @IsArray()
    itemIds: string[];
}

export class GetListDto extends EditShoppingListItemDto { }
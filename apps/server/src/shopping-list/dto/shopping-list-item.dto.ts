import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsOptional, IsString } from "class-validator";


export class BaseShoppingListItemDto {

    @ApiProperty()
    @IsString()
    name: string;

    @ApiProperty()
    @IsBoolean()
    @IsOptional()
    isPurchased: boolean;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    image?: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    category?: string;

    @ApiProperty()
    @IsBoolean()
    @IsOptional()
    isUrgent: boolean;

    @ApiProperty()
    amount: number;

    creatorId: string;

    createdAt: string;
}
export class ShoppingListItemDto extends BaseShoppingListItemDto {

}

export class NewShoppingListItemDto extends BaseShoppingListItemDto {

}
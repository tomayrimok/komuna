import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsString, Length } from 'class-validator';

export class BaseShoppingListItemDto {
  @ApiProperty()
  @IsString()
  @Length(1, 100)
  name: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  image?: string;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isPurchased: boolean;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isUrgent: boolean;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  amount: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  creatorId: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  createdAt: string;
}

export class ShoppingListItemDto extends PartialType(BaseShoppingListItemDto) { }

export class NewShoppingListItemDto extends BaseShoppingListItemDto { }

export class ShoppingListItemWithIdDto extends BaseShoppingListItemDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  itemId?: string;
}

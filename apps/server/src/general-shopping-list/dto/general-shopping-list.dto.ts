import { IsUUID, IsString, IsOptional, IsArray, IsBoolean, ValidateNested, IsEnum, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { ContextType } from '@komuna/types';
import { RecurrenceRuleDto } from '../../recurrence-rule/recurrence-rule.dto';
import { ShoppingListTemplateItem } from '../general-shopping-list.entity';

export class ShoppingListTemplateItemDto implements ShoppingListTemplateItem {

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    itemId?: string;

    @ApiProperty()
    @IsString()
    name: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    category?: string;

    @ApiProperty()
    @IsNumber()
    amount: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsBoolean()
    isUrgent?: boolean;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    image?: string;
}

export class CreateGeneralShoppingListDto {
    @ApiProperty()
    @IsUUID()
    apartmentId: string;

    @ApiProperty()
    @IsString()
    title: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ enum: ContextType, enumName: 'ContextType' })
    @IsEnum(ContextType)
    targetContextType: ContextType;

    @ApiProperty({ type: [ShoppingListTemplateItemDto] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ShoppingListTemplateItemDto)
    items: ShoppingListTemplateItemDto[];

    @ApiProperty({ required: false })
    @IsOptional()
    @ValidateNested()
    @Type(() => RecurrenceRuleDto)
    recurrenceRule?: RecurrenceRuleDto;

    @ApiProperty({ required: false, default: true })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

    @ApiProperty({ required: false, default: false })
    @IsOptional()
    @IsBoolean()
    isManualOnly?: boolean;
}

export class UpdateGeneralShoppingListDto {

    @ApiProperty()
    @IsUUID()
    generalShoppingListId: string;

    @ApiProperty({ required: false })
    @IsUUID()
    @IsOptional()
    apartmentId?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    title?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ enum: ContextType, enumName: 'ContextType', required: false })
    @IsOptional()
    targetContextType?: ContextType;

    @ApiProperty({ type: [ShoppingListTemplateItemDto], required: false })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ShoppingListTemplateItemDto)
    items?: ShoppingListTemplateItemDto[];

    @ApiProperty({ required: false })
    @IsOptional()
    @ValidateNested()
    @Type(() => RecurrenceRuleDto)
    recurrenceRule?: RecurrenceRuleDto;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsBoolean()
    isManualOnly?: boolean;
}

export class GenerateShoppingListFromTemplateDto {
    @ApiProperty()
    @IsUUID()
    generalShoppingListId: string;

    @ApiProperty({ enum: ContextType, enumName: 'ContextType', required: false })
    @IsOptional()
    targetContextType?: ContextType; // Override the default target context

    @ApiProperty({ required: false })
    @IsOptional()
    @IsUUID()
    targetUserId?: string; // Specific user ID for personal lists
} 
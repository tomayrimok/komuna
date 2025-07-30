import { ContextType } from '../enums';
import { RecurrenceRule } from './recurrence-rule.dto';

export interface ShoppingListTemplateItemDto {
    name: string;
    category?: string;
    amount: number;
    isUrgent?: boolean;
    image?: string;
}

export interface CreateGeneralShoppingListDto {
    apartmentId: string;
    title: string;
    description?: string;
    targetContextType: ContextType;
    items: ShoppingListTemplateItemDto[];
    recurrenceRule?: RecurrenceRule;
    isActive?: boolean;
    isManualOnly?: boolean;
}

export interface UpdateGeneralShoppingListDto {
    generalShoppingListId: string;
    title?: string;
    description?: string;
    targetContextType?: ContextType;
    items?: ShoppingListTemplateItemDto[];
    recurrenceRule?: RecurrenceRule;
    isActive?: boolean;
    isManualOnly?: boolean;
}

export interface GenerateShoppingListFromTemplateDto {
    generalShoppingListId: string;
    targetContextType?: ContextType;
    targetUserId?: string;
}

export interface GeneralShoppingListResponseDto {
    generalShoppingListId: string;
    apartmentId: string;
    title: string;
    description?: string;
    targetContextType: ContextType;
    items: ShoppingListTemplateItemDto[];
    recurrenceRule?: RecurrenceRule;
    isActive: boolean;
    isManualOnly: boolean;
    lastGeneratedAt?: Date;
    nextGenerationAt?: Date;
    createdBy: {
        userId: string;
        firstName: string;
        lastName: string;
    };
    createdByUserId: string;
    createdAt: Date;
    updatedAt: Date;
} 
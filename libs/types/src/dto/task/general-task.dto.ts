import { TaskType } from '../../enums';
import { RecurrenceRuleDto, User } from '../../generated';

export interface CreateGeneralTaskDto {
    title: string;
    description?: string;
    taskType?: TaskType;
    defaultDueTime?: string;
    recurrenceRule: RecurrenceRuleDto;
    apartmentId: string;
    defaultAssignedTo?: User[];
}

export interface UpdateGeneralTaskDto {
    generalTaskId: string;
    title?: string;
    description?: string;
    taskType?: TaskType;
    defaultDueTime?: string;
    recurrenceRule?: RecurrenceRuleDto;
    isActive?: boolean;
    defaultAssignedTo?: User[];
}

export interface GeneralTaskResponseDto {
    generalTaskId: string;
    title: string;
    description?: string;
    taskType: TaskType;
    defaultDueTime?: string;
    recurrenceRule: RecurrenceRuleDto;
    isActive: boolean;
    lastGeneratedAt?: Date;
    nextGenerationAt?: Date;
    createdBy: User;
    defaultAssignedTo?: User[];
    createdAt: Date;
    updatedAt: Date;
} 
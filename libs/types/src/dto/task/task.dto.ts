import { IsUUID, IsString, IsBoolean, IsDateString, IsOptional, ValidateIf, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { RecurrenceRuleDto } from '../recurrence-rule.dto';

export class TaskDto {
  @IsUUID()
  apartmentId: string;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsOptional()
  @ValidateIf((o) => typeof o.assignedTo === 'string')
  @IsUUID()
  assignedTo: string | string[];

  @IsBoolean()
  isCompleted: boolean;

  @IsDateString()
  dueDate: string;

  @IsBoolean()
  isRecurrent: boolean;

  @IsOptional()
  @ValidateNested()
  @Type(() => RecurrenceRuleDto)
  recurrenceRule?: RecurrenceRuleDto;

  @IsString()
  createdBy: string;
}

export class GetTaskDto {
  @IsUUID()
  userId: string;

  @IsUUID()
  apartmentId: string;
}

export class UpdateTaskDto {
  @IsUUID()
  taskId: string;

  @IsOptional()
  dueDate?: string;

  @IsOptional()
  isCompleted?: boolean;
}

export interface UserCompletionStatus {
  userId: string;
  isCompleted: boolean;
}

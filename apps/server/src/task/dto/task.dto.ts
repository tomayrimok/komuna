import { IsUUID, IsString, IsBoolean, IsDateString, IsOptional, ValidateNested, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { RecurrenceRuleDto } from '@komuna/types';

export class TaskDto {
  @IsUUID()
  apartmentId: string;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsUUID()
  assignedTo: string[];

  @IsBoolean()
  isCompleted: boolean;

  @IsDateString()
  dueDate: Date;

  @IsBoolean()
  isRecurrent: boolean;

  @IsOptional()
  @ValidateNested()
  @Type(() => RecurrenceRuleDto)
  recurrenceRule?: RecurrenceRuleDto;

  @IsString()
  createdBy: string;
}

export class EditTaskReqDto {
  @IsUUID()
  taskId: string;

  @IsDateString()
  dueDate: Date;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsBoolean()
  isRecurrent: boolean;

  @IsOptional()
  @IsEnum(RecurrenceRuleDto)
  recurrenceRule?: RecurrenceRuleDto;

  @IsOptional()
  @IsUUID()
  assignedTo?: string[];
}

export class UpdateTaskReqDto {
  @IsUUID()
  taskId: string;

  @IsBoolean()
  isCompleted: boolean;
}

import {
    IsUUID,
    IsString,
    IsBoolean,
    IsDateString,
    IsOptional,
    ValidateNested,
  } from 'class-validator';
  import { Type } from 'class-transformer';
  import { RecurrenceRuleDto } from '../recurrence-rule.dto';
  
  export class CreateTaskDto {
    @IsUUID()
    apartmentId: string;
  
    @IsString()
    title: string;
  
    @IsString()
    description: string;
  
    @IsOptional()
    @IsString()
    assignedTo: string[];
  
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
  
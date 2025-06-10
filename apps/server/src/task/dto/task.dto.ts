import { IsUUID, IsString, IsBoolean, IsDateString, IsOptional, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { RecurrenceRuleDto } from '@komuna/types';
import { ApiProperty } from '@nestjs/swagger';
import { UserCompletionStatus } from './user-completion-status.dto';
import { CreateTaskReqDto, EditTaskReqResDto } from '@komuna/types';
import { PartialType } from '@nestjs/swagger';


// Both for request and response, Create and Edit DTOs
export class CreateTaskDto implements CreateTaskReqDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'An object containing { userId, IsCompleted } for each assigned user.' })
  @IsOptional()
  @IsUUID()
  @IsArray()
  @Type(() => String)
  assignedTo: string[];

  @ApiProperty({ description: 'ISO date string for when the task is due', required: false })
  @IsDateString()
  @IsOptional()
  dueDate?: Date;

  @ApiProperty({ description: 'ISO time string for when the task is due', required: false })
  @IsString()
  @IsOptional()
  dueTime?: string;

  @ApiProperty({ description: 'Indicates wheter the task is recurring' })
  @IsBoolean()
  isRecurrent: boolean;

  @ApiProperty({
    description: 'RecurrenceRule is defined as a repetetive time-frame class object',
    example: '{"frequency": "weekly", "time": "10:00" }',
    required: false,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => RecurrenceRuleDto)
  recurrenceRule?: RecurrenceRuleDto;
}
class _EditTaskDto implements EditTaskReqResDto {
  @ApiProperty()
  @IsUUID()
  taskId: string;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty({ description: 'An object containing { userId, IsCompleted } for each assigned user.' })
  @IsOptional()
  @IsUUID()
  assignedTo: string[];

  @ApiProperty()
  @Type(() => UserCompletionStatus)
  @IsArray()
  completions: UserCompletionStatus[];

  @ApiProperty({ description: 'ISO date string for when the task is due' })
  @IsDateString()
  @IsOptional()
  dueDate?: Date;

  @ApiProperty({ description: 'ISO time string for when the task is due' })
  @IsString()
  @IsOptional()
  dueTime?: string;

  @ApiProperty({ description: 'Indicates wheter the task is recurring' })
  @IsBoolean()
  isRecurrent: boolean;

  @ApiProperty({
    description: 'RecurrenceRule is defined as a repetetive time-frame class object',
    example: '{"frequency": "weekly", "time": "10:00" }'
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => RecurrenceRuleDto)
  recurrenceRule?: RecurrenceRuleDto;
}
export class EditTaskDto extends PartialType(_EditTaskDto) {}

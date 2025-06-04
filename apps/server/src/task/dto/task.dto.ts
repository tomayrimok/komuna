import { IsUUID, IsString, IsBoolean, IsDateString, IsOptional, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { RecurrenceRuleDto } from '@komuna/types';
import { ApiProperty } from '@nestjs/swagger';
import { UserCompletionStatus } from './user-completion-status.dto';
import { CreateTaskReqDto, EditTaskReqResDto } from '@komuna/types';


// Both for request and response, Create and Edit DTOs
export class CreateTaskDto implements CreateTaskReqDto {
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

export class EditTaskDto implements EditTaskReqResDto {
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

import { IsUUID, IsString, IsBoolean, IsDateString, IsOptional, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { UserCompletionStatus } from './user-completion-status.dto';
import { PartialType } from '@nestjs/swagger';
import { RecurrenceRuleDto } from '../../recurrence-rule/recurrence-rule.dto';
import { User } from '../../user/user.entity';


// Both for request and response, Create and Edit DTOs
export class CreateTaskDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsUUID()
  apartmentId: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'An object containing { userId, IsCompleted } for each assigned user.', type: () => [User] })
  @IsOptional()
  @IsArray()
  @Type(() => User)
  assignedTo: User[];

  @ApiProperty({ description: 'ISO date string for when the task is due', required: false, type: () => Date })
  @IsDateString()
  @IsOptional()
  dueDate?: Date;

  @ApiProperty({ description: 'ISO time string for when the task is due', required: false })
  @IsString()
  @IsOptional()
  dueTime?: string;

  @ApiProperty({ description: 'Indicates wheter the task is recurring', required: false })
  @IsBoolean()
  @IsOptional()
  isRecurrent: boolean;

  @ApiProperty({
    description: 'RecurrenceRule is defined as a repetetive time-frame class object',
    example: '{"frequency": "weekly", "time": "10:00" }',
    required: false,
    type: () => RecurrenceRuleDto
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => RecurrenceRuleDto)
  recurrenceRule?: RecurrenceRuleDto;
}
export class UpdateTaskDto {
  @ApiProperty()
  @IsUUID()
  taskId: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  title: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({ description: 'An object containing { userId, IsCompleted } for each assigned user.', required: false, type: () => [User] })
  @IsOptional()
  assignedTo: User[];

  @ApiProperty({ type: [UserCompletionStatus], required: false })
  @Type(() => UserCompletionStatus)
  @IsArray()
  @IsOptional()
  completions: UserCompletionStatus[];

  @ApiProperty({ description: 'ISO date string for when the task is due', required: false })
  @IsDateString()
  @IsOptional()
  dueDate?: Date;

  @ApiProperty({ description: 'ISO time string for when the task is due', required: false })
  @IsString()
  @IsOptional()
  dueTime?: string;

  @ApiProperty({ description: 'Indicates wheter the task is recurring', required: false })
  @IsOptional()
  @IsBoolean()
  isRecurrent: boolean;

  @ApiProperty({
    description: 'RecurrenceRule is defined as a repetetive time-frame class object',
    example: '{"frequency": "weekly", "time": "10:00" }',
    type: () => RecurrenceRuleDto,
    required: false
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => RecurrenceRuleDto)
  recurrenceRule?: RecurrenceRuleDto;
}
// export class EditTaskDto extends PartialType(_EditTaskDto) { }


export class TaskResponseDto {
  @ApiProperty()
  taskId: string;

  @ApiProperty()
  title: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty({ description: 'An object containing { userId, IsCompleted } for each assigned user.', required: false, type: () => [User] })
  assignedTo?: User[];

  @ApiProperty({
    description: 'The user who created the task',
    type: () => User,
  })
  createdBy: User;

  @ApiProperty({ type: [UserCompletionStatus], required: false })
  completions?: UserCompletionStatus[];

  @ApiProperty({ description: 'ISO date string for when the task is due', required: false, type: () => Date })
  dueDate?: Date;

  @ApiProperty({ description: 'ISO time string for when the task is due', required: false })
  dueTime?: string;

  @ApiProperty({ description: 'Indicates whether the task is recurring' })
  isRecurrent: boolean;

  @ApiProperty({
    description: 'RecurrenceRule is defined as a repetitive time-frame class object',
    example: '{"frequency": "weekly", "time": "10:00" }',
    required: false,
    type: () => RecurrenceRuleDto
  })
  recurrenceRule?: RecurrenceRuleDto;
}

export class AddEditTaskDto {
  @ApiProperty({ required: false })
  @IsOptional()
  taskId: string;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'ISO date string for when the task is due', required: false })
  @IsDateString()
  @IsOptional()
  dueDate?: Date;

  @ApiProperty({ description: 'ISO time string for when the task is due', required: false })
  @IsString()
  @IsOptional()
  dueTime?: string;

  @ApiProperty({ description: 'Indicates wheter the task is recurring', required: false })
  @IsOptional()
  @IsBoolean()
  isRecurrent: boolean;

  @ApiProperty()
  @IsUUID()
  apartmentId: string;

  @ApiProperty({ description: 'An object containing { userId, IsCompleted } for each assigned user.', required: false, type: () => [User] })
  @IsOptional()
  @IsArray()
  @Type(() => User)
  assignedTo?: User[];

}

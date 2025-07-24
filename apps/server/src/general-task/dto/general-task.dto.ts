import { TaskType } from '@komuna/types';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsOptional, IsString, IsUUID, ValidateNested } from 'class-validator';
import { RecurrenceRuleDto } from '../../recurrence-rule/recurrence-rule.dto';
import { User } from '../../user/user.entity';

export class CreateGeneralTaskDto {
    @ApiProperty()
    @IsString()
    title: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ description: 'Task type', enum: TaskType, enumName: 'TaskType' })
    @IsOptional()
    @IsString()
    taskType?: TaskType;

    @ApiProperty({ description: 'Default due time for generated tasks', required: false })
    @IsString()
    @IsOptional()
    defaultDueTime?: string;

    @ApiProperty({
        description: 'RecurrenceRule defining when tasks should be generated',
        type: () => RecurrenceRuleDto,
    })
    @ValidateNested()
    @Type(() => RecurrenceRuleDto)
    recurrenceRule: RecurrenceRuleDto;

    @ApiProperty()
    @IsUUID()
    apartmentId: string;

    @ApiProperty({ description: 'Default users assigned to generated tasks', required: false, type: () => [User] })
    @IsOptional()
    @IsArray()
    @Type(() => User)
    defaultAssignedTo?: User[];

    @ApiProperty({ description: 'Whether this general task is active', required: false })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}

export class UpdateGeneralTaskDto {
    @ApiProperty()
    @IsUUID()
    generalTaskId: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    title?: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({ description: 'Task type', enum: TaskType, enumName: 'TaskType', required: false })
    @IsOptional()
    @IsString()
    taskType?: TaskType;

    @ApiProperty({ description: 'Default due time for generated tasks', required: false })
    @IsString()
    @IsOptional()
    defaultDueTime?: string;

    @ApiProperty({
        description: 'RecurrenceRule defining when tasks should be generated',
        type: () => RecurrenceRuleDto,
        required: false
    })
    @IsOptional()
    @ValidateNested()
    @Type(() => RecurrenceRuleDto)
    recurrenceRule?: RecurrenceRuleDto;

    @ApiProperty({ description: 'Whether this general task is active', required: false })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

    @ApiProperty({ description: 'Default users assigned to generated tasks', required: false, type: () => [User] })
    @IsOptional()
    @IsArray()
    @Type(() => User)
    defaultAssignedTo?: User[];
}

export class GeneralTaskResponseDto {
    @ApiProperty()
    generalTaskId: string;

    @ApiProperty()
    title: string;

    @ApiProperty({ required: false })
    description?: string;

    @ApiProperty({ description: 'Task type', enum: TaskType, enumName: 'TaskType' })
    taskType: TaskType;

    @ApiProperty({ description: 'Default due time for generated tasks', required: false })
    defaultDueTime?: string;

    @ApiProperty({
        description: 'RecurrenceRule defining when tasks should be generated',
        type: () => RecurrenceRuleDto,
    })
    recurrenceRule: RecurrenceRuleDto;

    @ApiProperty({ description: 'Whether this general task is active' })
    isActive: boolean;

    @ApiProperty({ description: 'When the last task was generated from this template', required: false })
    lastGeneratedAt?: Date;

    @ApiProperty({ description: 'When the next task should be generated', required: false })
    nextGenerationAt?: Date;

    @ApiProperty({
        description: 'The user who created this general task',
        type: () => User,
    })
    createdBy: User;

    @ApiProperty({ description: 'Default users assigned to generated tasks', required: false, type: () => [User] })
    defaultAssignedTo?: User[];

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;
} 
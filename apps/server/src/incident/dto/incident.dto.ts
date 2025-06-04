import { IsUUID, IsString, IsEnum, IsOptional, IsDateString, IsArray } from 'class-validator';
import { IncidentStatus, IncidentUrgency } from '@komuna/types';
import { ApiProperty } from '@nestjs/swagger';
import {
  CreateIncidentDto as CreateIncidentDtoReq,
  UpdateIncidentStatusDto as UpdateIncidentStatusDtoReq,
  AddCommentDto as AddCommentDtoReq
} from '@komuna/types';

export class CreateIncidentDto implements CreateIncidentDtoReq {
  createdAt: string;
  status: IncidentStatus;
  reporterId: string;
  // @ApiProperty()
  // @IsUUID()
  // reporterId: string;

  @ApiProperty()
  @IsUUID()
  apartmentId: string;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  description: string;

  // @ApiProperty({ description: 'Status of the incident used by Enum IncidentStatus', enum: IncidentStatus, enumName: 'IncidentStatus' })
  // @IsEnum(IncidentStatus)
  // status: IncidentStatus;

  @ApiProperty({ description: 'How urgent the incident is. used by Enum IncidentUrgency', enum: IncidentUrgency, enumName: 'IncidentUrgency' })
  @IsEnum(IncidentUrgency)
  urgencyLevel: IncidentUrgency;

  // @IsDateString()
  // createdAt: string;

  // @ApiProperty({ description: 'Where the incident orccured' })
  // @IsString()
  // location: string;

  @ApiProperty({ required: false, type: [String], description: 'List of image URLs related to the incident' })
  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  images?: string[];
}

export class UpdateIncidentStatusDto implements UpdateIncidentStatusDtoReq {
  @ApiProperty()
  @IsUUID()
  incidentId: string;

  @ApiProperty()
  @IsEnum(IncidentStatus)
  status: IncidentStatus;

  @ApiProperty()
  @IsDateString()
  updatedAt: string;
}

export class AddCommentDto implements AddCommentDtoReq {
  @ApiProperty()
  @IsUUID()
  incidentId: string;

  @ApiProperty()
  @IsUUID()
  userId: string;

  @ApiProperty()
  @IsString()
  message: string;

  @ApiProperty()
  @IsOptional()
  @IsString({ each: true })
  images?: string[];
}


export class GetIncidentsDto {
  @ApiProperty()
  @IsUUID()
  apartmentId: string;
}

export class GetIncidentDto {
  @ApiProperty()
  @IsUUID()
  incidentId: string;
}
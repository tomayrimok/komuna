import { IsUUID, IsString, IsEnum, IsOptional, IsDateString, IsArray } from 'class-validator';
import { IncidentStatus, IncidentUrgency } from '@komuna/types';
import { ApiProperty } from '@nestjs/swagger';
import {
  CreateIncidentDto as CreateIncidentDtoReq,
  AddCommentDto as AddCommentDtoReq
} from '@komuna/types';
import { Incident } from '../incident.entity';
import { User } from '../../user/user.entity';



// export class CreateIncidentDto implements CreateIncidentDtoReq {
//   status: IncidentStatus;
//   createdAt: string;
//   reporterId: string;

//   @ApiProperty()
//   @IsUUID()
//   apartmentId: string;

//   @ApiProperty()
//   @IsString()
//   title: string;

//   @ApiProperty()
//   @IsOptional()
//   @IsString()
//   description: string;

//   @ApiProperty({ description: 'How urgent the incident is. used by Enum IncidentUrgency', enum: IncidentUrgency, enumName: 'IncidentUrgency' })
//   @IsEnum(IncidentUrgency)
//   urgencyLevel: IncidentUrgency;

//   @ApiProperty({ required: false, type: [String], description: 'List of image URLs related to the incident' })
//   @IsString({ each: true })
//   @IsArray()
//   @IsOptional()
//   images?: string[];
// }

export class UpdateIncidentDto {
  @ApiProperty()
  @IsUUID()
  incidentId: string;

  @ApiProperty({ required: false, enum: IncidentStatus, enumName: 'IncidentStatus' })
  @IsEnum(IncidentStatus)
  @IsOptional()
  status?: IncidentStatus;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false, enum: IncidentUrgency, enumName: 'IncidentUrgency' })
  @IsEnum(IncidentUrgency)
  @IsOptional()
  urgencyLevel?: IncidentUrgency;

  @ApiProperty({ required: false, type: [String], description: 'List of image URLs related to the incident' })
  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  images?: string[];
}

export class AddCommentDto implements AddCommentDtoReq {
  userId: string;
  @ApiProperty()
  @IsUUID()
  incidentId: string;

  @ApiProperty()
  @IsString()
  message: string;

  @ApiProperty({ required: false, type: [String], description: 'List of image URLs related to the comment' })
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

export class CommentResponseDto {
  @ApiProperty()
  @IsUUID()
  commentId: string;

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
  @IsDateString()
  createdAt: string;

  @ApiProperty()
  user: User;

}

export class IncidentResponseDto {

  @ApiProperty()
  incidentId: string;

  @ApiProperty()
  apartmentId: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  images?: string[];

  @ApiProperty({ enum: IncidentUrgency, enumName: 'IncidentUrgency' })
  urgencyLevel: IncidentUrgency;

  @ApiProperty()
  reporterId: string;

  @ApiProperty({ type: () => User })
  reporter: User;

  @ApiProperty({ enum: IncidentStatus, enumName: 'IncidentStatus' })
  status: IncidentStatus;

  @ApiProperty()
  seenByManager: boolean;

  @ApiProperty()
  managerResponse: string;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({ type: () => [CommentResponseDto] })
  @IsArray()
  @IsOptional()
  comments: CommentResponseDto[];
}


export class AddEditIncidentDto {

  @ApiProperty({ required: false })
  @IsOptional()
  incidentId: string;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty({ description: 'How urgent the incident is. used by Enum IncidentUrgency', enum: IncidentUrgency, enumName: 'IncidentUrgency' })
  @IsEnum(IncidentUrgency)
  urgencyLevel: IncidentUrgency;

  @ApiProperty()
  @IsUUID()
  apartmentId: string;



}
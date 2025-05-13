import {
    IsUUID,
    IsString,
    IsEnum,
    IsBoolean,
    IsOptional,
    IsDateString,
  } from 'class-validator';
import { IncidentStatus, IncidentUrgency } from "../../enums";

export class CreateIncidentDto {
    @IsUUID()
    incidentId: string;

    @IsUUID()
    userId: string;

    @IsUUID()
    apartmentId: string;
    
    @IsString()
    incidentName: string;
    
    @IsOptional()
    @IsString()
    description: string;
    
    @IsEnum(IncidentStatus)
    status: IncidentStatus;
    
    @IsEnum(IncidentUrgency)
    urgencyLevel: IncidentUrgency;
    
    @IsDateString()
    createdAt: string;
    
    @IsString()
    location: string;
    
    @IsBoolean()
    includingImages: boolean;
}

export class UpdateIncidentStatusDto {
    @IsUUID()
    incidentId: string;

    @IsEnum(IncidentStatus)
    status: IncidentStatus;
    
    @IsDateString()
    updatedAt: string;
}

export class AddCommentDto {
    @IsUUID()
    incidentId: string;

    @IsUUID()
    userId: string;

    @IsString()
    comment: string;

    @IsDateString()
    addedOn: string;

    @IsBoolean()
    includingImages: boolean;
}

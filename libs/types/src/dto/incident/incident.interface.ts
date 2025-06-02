import { IncidentStatus, IncidentUrgency } from "@komuna/types";


export interface CreateIncidentDto {

    userId: string; // UUID

    apartmentId: string; // UUID
    
    incidentName: string;
    
    description: string;
    
    status: IncidentStatus;
    
    urgencyLevel: IncidentUrgency;
    
    createdAt: string; // ISO date string
    
    location: string;
    
    includingImages: boolean;

    ownerSeen: boolean;
}

export interface UpdateIncidentStatusDto {

    incidentId: string; // UUID

    status: IncidentStatus; // ENUM
    
    updatedAt: string; // ISO date string
}

export interface AddCommentDto {

    incidentId: string; //UUID

    userId: string; // UUID

    message: string;

    images?: string[];
}
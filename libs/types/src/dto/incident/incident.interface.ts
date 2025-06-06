import { IncidentStatus, IncidentUrgency } from "@komuna/types";


export interface CreateIncidentDto {
    
    incidentName: string;
    
    description: string;
    
    status: IncidentStatus;
    
    urgencyLevel: IncidentUrgency;
    
    createdAt: string; // ISO date string
    
    location: string;

}

export interface UpdateIncidentStatusDto {

    incidentId: string; // UUID

    status: IncidentStatus; // ENUM
    
}

export interface AddCommentDto {

    incidentId: string; //UUID

    message: string;

}
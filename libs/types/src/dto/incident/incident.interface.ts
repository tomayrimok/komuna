import { IncidentStatus, IncidentUrgency } from '@komuna/types';

export interface CreateIncidentDto {
  // reporterId: string; // UUID

  apartmentId: string; // UUID

  title: string;

  description: string;

  status: IncidentStatus;

  urgencyLevel: IncidentUrgency;

  createdAt: string; // ISO date string

  // location: string;

  images?: string[];
}

export interface AddCommentDto {
  incidentId: string; //UUID

  userId: string; // UUID

  message: string;

  images?: string[];
}

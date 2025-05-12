import { IncidentStatus, IncidentUrgency } from "../../enums";

export class CreateIncident {
    incidentId: string;
    incidentName: string;
    description: string;
    status: IncidentStatus;
    urgencyLevel: IncidentUrgency;
    createdAt: string;
    location: string;
}

export class UpdateIncident {

}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Incident } from './incident.entity';
import { Repository } from 'typeorm';
import { AddCommentDto } from './dto/incident.dto'

@Injectable()
export class IncidentService {
    constructor(
        @InjectRepository(Incident)
        private readonly incidentRepo: Repository<Incident>
    ) {}

    async createIncident(incident: Incident) {
        return await this.incidentRepo.save(incident)
    }

    async updateIncident(incidentId: string, status: Partial<Incident>) {
        return await this.incidentRepo.update({ incidentId }, status)
    }

    async addComment(incidentId: string, commentDto: AddCommentDto) {
        const comment = this.incidentRepo.create(commentDto);

        return await this.incidentRepo.save(comment);
    }
}

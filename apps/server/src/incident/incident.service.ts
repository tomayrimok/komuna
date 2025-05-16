import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Incident } from './incident.entity';
import { Repository } from 'typeorm';
import { AddCommentDto, CreateIncidentDto, UpdateIncidentStatusDto } from '@komuna/types';

@Injectable()
export class IncidentService {
  constructor(
    @InjectRepository(Incident)
    private readonly incidentRepo: Repository<Incident>
  ) {}

  async createIncident(incidentDto: CreateIncidentDto): Promise<Incident> {
    const incident = this.incidentRepo.create(incidentDto);
    return await this.incidentRepo.save(incident);
  }

  async updateIncidentStatus(incidentDto: UpdateIncidentStatusDto) {
    const incident = await this.incidentRepo.findOneBy({ incidentId: incidentDto.incidentId });
    if (!incident) {
      throw new NotFoundException(`Incident ${incidentDto.incidentId} not found`);
    }
    incident.status = incidentDto.status;
    return this.incidentRepo.save(incident);
  }

  async addComment(commentDto: AddCommentDto) {
    const incident = await this.incidentRepo.findOneBy({ incidentId: commentDto.incidentId });
    const comments = incident.comments ?? [];
    const nextId = (comments.length + 1).toString();
    comments.push({
      commentId: nextId,
      message: commentDto.comment,
      userId: commentDto.userId,
      createAt: commentDto.addedOn,
      images: commentDto.images,
    });
    incident.comments = comments;
    return await this.incidentRepo.save(incident);
  }

  async getByApartment(apartmentId: string): Promise<Incident[]> {
    try {
      return await this.incidentRepo.find({
        where: { apartmentId },
        order: { createdAt: 'DESC' },
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to load incidents', error);
    }
  }
}

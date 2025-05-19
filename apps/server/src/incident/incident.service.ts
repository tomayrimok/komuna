import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Incident, Comment } from './incident.entity';
import { Repository } from 'typeorm';
import { AddCommentDto, CreateIncidentDto, UpdateIncidentStatusDto } from '@komuna/types';

@Injectable()
export class IncidentService {
  constructor(
    @InjectRepository(Incident)
    private readonly incidentRepo: Repository<Incident>,

    @InjectRepository(Comment)
    private readonly commentRepo: Repository<Comment>,
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

  async addComment(commentDto: AddCommentDto): Promise<Comment> {
    const incident = await this.incidentRepo.findOneBy({
      incidentId: commentDto.incidentId,
    });
    if (!incident) {
      throw new NotFoundException(`Incident with id ${commentDto.incidentId} not found`);
    }

    const comment = this.commentRepo.create({
      incidentId: commentDto.incidentId,
      userId: commentDto.userId,
      message: commentDto.message,
      images: commentDto.images, // optional
    });

    // 3. Save it — commentId & createdAt come back populated
    return this.commentRepo.save(comment);
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

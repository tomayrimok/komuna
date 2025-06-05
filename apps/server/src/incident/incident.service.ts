import { Injectable, InternalServerErrorException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Incident, Comment } from './incident.entity';
import { UserApartmentService } from '../user-apartment/user-apartment.service';
import { Repository } from 'typeorm';
import { CreateIncidentDto, UpdateIncidentStatusDto, AddCommentDto } from './dto/incident.dto';

@Injectable()
export class IncidentService {
  constructor(
    @InjectRepository(Incident)
    private readonly incidentRepo: Repository<Incident>,

    @InjectRepository(Comment)
    private readonly commentRepo: Repository<Comment>,

    private readonly userApartmentService: UserApartmentService
  ) { }

  async createIncident(incidentDto: CreateIncidentDto, userId: string): Promise<Incident> {
    // Check if user is a resident of the apartment
    const userMemberOfApartment: boolean = await this.userApartmentService.isUserInApartment(
      incidentDto.reporterId,
      incidentDto.apartmentId
    );
    if (!userMemberOfApartment) {
      throw new ForbiddenException(
        `User ${incidentDto.reporterId} is not a resident of apartment ${incidentDto.apartmentId}`
      );
    }

    const toSave = this.incidentRepo.create({ ...incidentDto, reporterId: userId });
    return this.incidentRepo.save(toSave);
  }

  async updateIncidentStatus(incidentDto: UpdateIncidentStatusDto) {
    const incident = await this.incidentRepo.findOneBy({ incidentId: incidentDto.incidentId });
    if (!incident) {
      throw new NotFoundException(`Incident ${incidentDto.incidentId} not found`);
    }
    incident.status = incidentDto.status;
    return this.incidentRepo.save(incident);
  }

  async addComment(commentDto: AddCommentDto, userId: string): Promise<Comment> {
    const incident = await this.incidentRepo.findOneBy({
      incidentId: commentDto.incidentId,
    });
    if (!incident) {
      throw new NotFoundException(`Incident with id ${commentDto.incidentId} not found`);
    }

    const comment = this.commentRepo.create({
      incidentId: commentDto.incidentId,
      userId: userId,
      message: commentDto.message
    });

    return this.commentRepo.save(comment);
  }

  async getComments(incidentId: string, numOfComments = 10): Promise<Comment[]> {
    if (typeof numOfComments !== 'number') {
      numOfComments = 10;
    }

    const comments = await this.commentRepo.find({
      where: { incidentId },
      order: { createdAt: 'DESC' },
      take: numOfComments,
    });

    return comments;
  }

  async getIncidentsByApartment(apartmentId: string): Promise<Incident[]> {
    try {
      return await this.incidentRepo.find({
        where: { apartmentId },
        order: { createdAt: 'DESC' },
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to load incidents ', error);
    }
  }

  async setOwnerSeen(incidentId: string, apartmentId: string) {
    try {
      return this.incidentRepo.update(
        { incidentId, apartmentId },
        { seenByManager: true }
      )
    } catch (error) {
      throw new InternalServerErrorException('Failed to set owner seen status ', error);
    }
  }

  async getIncidentDetails(incidentId: string): Promise<Incident> {
    const incident = await this.incidentRepo.findOne({
      where: { incidentId },
      relations: ['comments'],
    });

    if (!incident) {
      throw new NotFoundException(`Incident with id ${incidentId} not found`);
    }

    return incident;
  }
}

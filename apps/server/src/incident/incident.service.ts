import { Injectable, InternalServerErrorException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Incident, Comment } from './incident.entity';
import { UserApartmentService } from '../user-apartment/user-apartment.service';
import { Repository } from 'typeorm';
import { AddEditIncidentDto, AddCommentDto, UpdateIncidentDto } from './dto/incident.dto';
import { NotificationService } from '../notification/notification.service';
import { IncidentStatus, UserRole } from '@komuna/types';

const incidentStatusesHe = {
  [IncidentStatus.IN_PROGRESS]: 'עברה למצב ״בטיפול״',
  [IncidentStatus.OPEN]: 'חזרה לסטטוס ״פתוח״',
  [IncidentStatus.SOLVED]: 'נסגרה',
};
@Injectable()
export class IncidentService {
  constructor(
    @InjectRepository(Incident)
    private readonly incidentRepo: Repository<Incident>,

    @InjectRepository(Comment)
    private readonly commentRepo: Repository<Comment>,

    private readonly userApartmentService: UserApartmentService,
    private readonly notificationService: NotificationService, // Assuming you have a NotificationService for handling notifications
  ) { }

  async addEditIncident(incidentDto: AddEditIncidentDto, userId: string): Promise<Incident> {

    if (incidentDto.incidentId) {
      const existingIncident = await this.incidentRepo.findOneBy({
        incidentId: incidentDto.incidentId,
        apartmentId: incidentDto.apartmentId,
      });

      if (existingIncident) return this.incidentRepo.save({ ...existingIncident, ...incidentDto });
    }

    const newIncident = this.incidentRepo.create({
      ...incidentDto,
      reporterId: userId
    });
    try {
      this.notificationService.sendNotificationToApartment(incidentDto.apartmentId, { notification: { title: 'נוצרה תקלה חדשה', body: incidentDto.title } }, [UserRole.LANDLORD, UserRole.ROOMMATE], userId);
      return await this.incidentRepo.save(newIncident);
    }
    catch (error) {
      throw new InternalServerErrorException('Failed to create or update incident', error);
    }

  }

  async updateIncident(incidentDto: UpdateIncidentDto, userId: string): Promise<Incident> {
    const incident = await this.incidentRepo.findOneBy({ incidentId: incidentDto.incidentId });
    if (!incident) {
      throw new NotFoundException(`Incident ${incidentDto.incidentId} not found`);
    }
    if (incident.status !== incidentDto.status) {
      this.notificationService.sendNotificationToApartment(
        incident.apartmentId,
        { notification: { title: 'עדכון תקלה', body: `התקלה ״${incident.title}״ ${incidentStatusesHe[incidentDto.status]}` } },
        [UserRole.LANDLORD, UserRole.ROOMMATE],
        userId
      );
    }
    return this.incidentRepo.save({ ...incident, ...incidentDto });
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

    try {
      this.notificationService.sendNotificationToApartment(
        incident.apartmentId,
        { notification: { title: 'תגובה חדשה לתקלה', body: commentDto.message } },
        [UserRole.LANDLORD, UserRole.ROOMMATE],
        userId
      );
    } catch (error) {
      throw new InternalServerErrorException('Failed to send notification for new comment', error);
    }

    return this.commentRepo.save(comment);
  }

  async getIncidentsByApartment(apartmentId: string): Promise<Incident[]> {
    try {
      return await this.incidentRepo.find({
        where: { apartmentId },
        order: { createdAt: 'DESC' },
        relations: ['reporter', 'comments']
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
      relations: ['reporter', 'comments', 'comments.user'],
    });

    if (!incident) {
      throw new NotFoundException(`Incident with id ${incidentId} not found`);
    }

    return incident;
  }
}

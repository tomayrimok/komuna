import { Body, Controller, Logger, Post, Get, Query } from '@nestjs/common';
import { CreateIncidentDto, UpdateIncidentStatusDto, AddCommentDto } from './dto/incident.dto';
import {
  CreateIncidentDto as CreateIncidentDtoReq,
  UpdateIncidentStatusDto as UpdateIncidentStatusDtoReq,
  AddCommentDto as AddCommentDtoReq
} from '@komuna/types';
import { IncidentService } from './incident.service';
import { UseAuth } from '../decorators/UseAuth';
import { UserJwtPayload } from '../user/dto/jwt-user.dto';
import { User } from '../decorators/User';
import { UserApartmentService } from '../user-apartment/user-apartment.service';

@Controller('incident')
export class IncidentController {
  constructor(
    private readonly incidentService: IncidentService,
    private readonly userApartmentService: UserApartmentService
  ) {}
  private readonly logger = new Logger(IncidentController.name);

  @Get()
  @UseAuth()
  async getAllIncidents(@User() user: UserJwtPayload) {
    return await this.incidentService.getIncidentsByApartment(user.apartmentId);
  }

  @Post('create') // TODO redirect to the new incident - /create/id=?incidentId
  @UseAuth()
  async createIncident(@User() user: UserJwtPayload, @Body() newIncidentReq: CreateIncidentDtoReq) {
    const newIncident: CreateIncidentDto = {
      ...newIncidentReq,
      userId: user.userId,
      apartmentId: user.apartmentId,
    }
    return this.incidentService.createIncident(newIncident);
  }

  @Post('update')
  @UseAuth()
  async updateIncident(@User() user: UserJwtPayload, @Body() setIncident: UpdateIncidentStatusDtoReq) {
    const incident = await this.incidentService.getIncidentById(setIncident.incidentId);
    if (!incident) {
      this.logger.error('Incident not found', setIncident.incidentId);
      throw new Error('Incident not found');
    }
    if (!this.userApartmentService.isUserInApartment(user.userId, incident.apartmentId)) {
      this.logger.error('User is not a resident of the apartment', user.userId, incident.apartmentId);
      throw new Error('User is not a resident of the apartment');
    }
    return this.incidentService.updateIncidentStatus(setIncident);
  }

  @Post('comment')
  async newComment(@User() user: UserJwtPayload, @Body() addComment: AddCommentDto) {
    return this.incidentService.addComment(addComment);
  }

  @Post('owner-seen')
  async setOwnerSeen(@User() user: UserJwtPayload, @Query('incidentId') incidentId: string, @Query('apartmentId') apartmentId: string) {
    return this.incidentService.setOwnerSeen(incidentId, apartmentId);
  }
}

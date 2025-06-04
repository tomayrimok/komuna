import { Body, Controller, Logger, Post, Get, Query } from '@nestjs/common';
import { CreateIncidentDto, UpdateIncidentStatusDto, AddCommentDto } from './dto/incident.dto';
import { IncidentService } from './incident.service';
import { UseAuth } from '../decorators/UseAuth';

@Controller('incident')
export class IncidentController {
  constructor(private readonly incidentService: IncidentService) {}
  private readonly logger = new Logger(IncidentController.name);

  @Get()
  @UseAuth()
  async getAllIncidents(@Query('apartmentId') apartmendId: string) {
    return await this.incidentService.getIncidentsByApartment(apartmendId);
  }

  @Post('create') // TODO redirect to the new incident - /create/id=?incidentId
  async createIncident(@Body() newIncident: CreateIncidentDto) {
    return this.incidentService.createIncident(newIncident);
  }

  @Post('update')
  async updateIncident(@Body() setIncident: UpdateIncidentStatusDto) {
    return this.incidentService.updateIncidentStatus(setIncident);
  }

  @Post('comment')
  async newComment(@Body() addComment: AddCommentDto) {
    return this.incidentService.addComment(addComment);
  }

  @Post('owner-seen')
  async setOwnerSeen(@Query('incidentId') incidentId: string, @Query('apartmentId') apartmentId: string) {
    return this.incidentService.setOwnerSeen(incidentId, apartmentId);
  }
}

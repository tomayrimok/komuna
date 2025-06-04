import { Body, Controller, Logger, Post, Get, Query } from '@nestjs/common';
import { CreateIncidentDto, UpdateIncidentStatusDto, AddCommentDto, GetIncidentsDto, GetIncidentDto } from './dto/incident.dto';
import { IncidentService } from './incident.service';
import { UseAuth } from '../decorators/UseAuth';
import { ApiOkResponse } from '@nestjs/swagger';
import { Incident } from './incident.entity';
import { User as GetUser } from '../decorators/User';
import { User } from '../user/user.entity';

@Controller('incident')
export class IncidentController {
  constructor(private readonly incidentService: IncidentService) { }
  private readonly logger = new Logger(IncidentController.name);

  @Get()
  @UseAuth()
  @ApiOkResponse({ type: [Incident] })
  async getAllIncidents(@Query() query: GetIncidentsDto) {
    const { apartmentId } = query;
    return await this.incidentService.getIncidentsByApartment(apartmentId);
  }

  @Get('details')
  @UseAuth()
  @ApiOkResponse({ type: Incident })
  async getIncidentDetails(@Query() query: GetIncidentDto
  ) {
    const { incidentId } = query;
    return await this.incidentService.getIncidentDetails(incidentId);
  }

  @Post('create') // TODO redirect to the new incident - /create/id=?incidentId
  @UseAuth()
  @ApiOkResponse({ type: Incident })
  async createIncident(@Body() newIncident: CreateIncidentDto, @GetUser() user: User) {
    return await this.incidentService.createIncident(newIncident, user.userId);
  }

  @Post('update')
  async updateIncident(@Body() setIncident: UpdateIncidentStatusDto) {
    return await this.incidentService.updateIncidentStatus(setIncident);
  }

  @Post('comment')
  async newComment(@Body() addComment: AddCommentDto) {
    return await this.incidentService.addComment(addComment);
  }

  @Post('owner-seen')
  async setOwnerSeen(@Query('incidentId') incidentId: string, @Query('apartmentId') apartmentId: string) {
    return await this.incidentService.setOwnerSeen(incidentId, apartmentId);
  }
}

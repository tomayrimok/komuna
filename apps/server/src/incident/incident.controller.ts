import { Body, Controller, Get, Logger, Post, Query } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { UseAuth } from '../decorators/UseAuth';
import { User as GetUser } from '../decorators/User';
import { User } from '../user/user.entity';
import { AddCommentDto, AddEditIncidentDto, GetIncidentDto, GetIncidentsDto, IncidentResponseDto, UpdateIncidentDto } from './dto/incident.dto';
import { Comment, Incident } from './incident.entity';
import { IncidentService } from './incident.service';

@Controller('incident')
export class IncidentController {
  constructor(private readonly incidentService: IncidentService) { }
  private readonly logger = new Logger(IncidentController.name);

  @Get()
  @UseAuth()
  @ApiOkResponse({ type: [IncidentResponseDto] })
  async getAllIncidents(@Query() query: GetIncidentsDto) {
    const { apartmentId } = query;
    return await this.incidentService.getIncidentsByApartment(apartmentId);
  }

  @Get('details')
  @UseAuth()
  @ApiOkResponse({ type: IncidentResponseDto })
  async getIncidentDetails(@Query() query: GetIncidentDto
  ) {
    const { incidentId } = query;
    return await this.incidentService.getIncidentDetails(incidentId);
  }

  @Post('add-edit') // TODO redirect to the new incident - /create/id=?incidentId
  @UseAuth()
  @ApiOkResponse({ type: Incident })
  async addEditIncident(@Body() newIncident: AddEditIncidentDto, @GetUser() user: User) {
    return await this.incidentService.addEditIncident(newIncident, user.userId);
  }

  @Post('update')
  @UseAuth()
  @ApiOkResponse({ type: Incident })
  async updateIncident(@Body() setIncident: UpdateIncidentDto) {
    return await this.incidentService.updateIncident(setIncident);
  }

  @Post('comment')
  @UseAuth()
  @ApiOkResponse({ type: Comment })
  async newComment(@Body() addComment: AddCommentDto, @GetUser() user: User) {
    return await this.incidentService.addComment(addComment, user.userId);
  }

  @Post('owner-seen')
  async setOwnerSeen(@Query('incidentId') incidentId: string, @Query('apartmentId') apartmentId: string) {
    return await this.incidentService.setOwnerSeen(incidentId, apartmentId);
  }
}

import {
    Body,
    Controller,
    Logger,
    Post,
    Get,
} from '@nestjs/common';
import { CreateIncidentDto, UpdateIncidentStatusDto, AddCommentDto } from '@komuna/types';
import { IncidentService } from './incident.service';
import { UseAuth } from '../decorators/UseAuth';
import { User } from '../decorators/User';
import { UserJwtPayload } from '../user/dto/jwt-user.dto';



@Controller('incident')
export class IncidentController {
  constructor(private readonly incidentService: IncidentService) {}
  private readonly logger = new Logger(IncidentController.name)


    @Get()
    @UseAuth()
    async getAllIncidents(@User() user: UserJwtPayload) {
      try {
        const aptID = user.apartmentId;
        return this.incidentService.getIncidentsByApartment(aptID);
      } catch (error) {
        this.logger.error('Error in retrieving incidents', error)
      }
    }

    @Post('create') // TODO redirect to the new incident - /create/id=?incidentId
    async createIncident(@Body() newIncident: CreateIncidentDto) {
      return this.incidentService.createIncident(newIncident)
    }

    @Post('update')
    async updateIncident(@Body() setIncident: UpdateIncidentStatusDto) {
      return this.incidentService.updateIncidentStatus(setIncident)
    }

    @Post('comment')
    async newComment(@Body() addComment: AddCommentDto) {
      return this.incidentService.addComment(addComment);
    }
}

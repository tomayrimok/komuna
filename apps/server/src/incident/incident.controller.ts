import {
    Body,
    Controller,
    Logger,
    Post,
} from '@nestjs/common';
import { CreateIncidentDto, UpdateIncidentStatusDto, AddCommentDto } from './dto/incident.dto';
import { IncidentService } from './incident.service';

@Controller('incident')
export class IncidentController {
  constructor(private readonly incidentService: IncidentService) {}
  private readonly logger = new Logger(IncidentController.name)



    @Post('create')
    async createIncident(@Body() newIncident: CreateIncidentDto) {
      return(newIncident) // TODO implement Logic
    }

    @Post('update')
    async updateIncident(@Body() setIncident: UpdateIncidentStatusDto) {
      return(setIncident) // TODO implement Logic
    }

    @Post('comment')
    async newComment(@Body() addComment: AddCommentDto) {
      return(addComment) // TODO implement Logic
    }
}

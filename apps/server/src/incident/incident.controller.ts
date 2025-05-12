import {
    BadRequestException,
    Body,
    Controller,
    Get,
    InternalServerErrorException,
    Logger,
    Post,
    Res,
  } from '@nestjs/common';

@Controller('incident')
export class IncidentController {




    @Post('create')
    async createIncident(@Body())
}

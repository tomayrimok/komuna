import { Controller, Get, Query } from '@nestjs/common';
import { ApartmentService } from './apartment.service';
import { GetApartmentWithResidentsDto } from '../user/dto/apartment.dto';
import { Apartment } from './apartment.entity';
import { ApiOkResponse } from '@nestjs/swagger';

@Controller('apartment')
export class ApartmentController {
    constructor(
        private readonly apartmentService: ApartmentService,
    ) { }

    @Get()
    @ApiOkResponse({ type: Apartment })
    async getApartmentWithResidents(@Query() query: GetApartmentWithResidentsDto) {
        const { apartmentId } = query;
        return await this.apartmentService.getApartmentWithResidents(apartmentId);
    }
}

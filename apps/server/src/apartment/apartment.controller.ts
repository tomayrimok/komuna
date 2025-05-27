import { Controller, Get, Query } from '@nestjs/common';
import { ApartmentService } from './apartment.service';

@Controller('apartment')
export class ApartmentController {
    constructor(
        private readonly apartmentService: ApartmentService,
    ) { }

    @Get()
    async getApartmentWithResidents(@Query('apartmentId') apartmentId: string) {
        return await this.apartmentService.getApartmentWithResidents(apartmentId);
    }
}

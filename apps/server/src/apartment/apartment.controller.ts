import { Body, Controller, Post, Get, Query } from '@nestjs/common';
import { ApartmentService } from './apartment.service';
import { CreateApartmentDto } from './dto/create-apartment.dto';

@Controller('apartment')
export class ApartmentController {
  constructor(private readonly apartmentService: ApartmentService) { }

  @Post()
  createApartment(@Body() apartmentData: CreateApartmentDto) {
    return this.apartmentService.createApartment(apartmentData);
  }

  @Get()
    async getApartmentUsers(@Query('apartmentId') apartmentId: string) {
        return await this.apartmentService.getApartmentWithResidents(apartmentId);
    }
}

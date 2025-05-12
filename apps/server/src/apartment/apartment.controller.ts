import { Body, Controller, Post } from '@nestjs/common';
import { ApartmentService } from './apartment.service';
import { CreateApartmentDto } from './dto/create-apartment.dto';

@Controller('apartment')
export class ApartmentController {
  constructor(private readonly apartmentService: ApartmentService) { }

  @Post()
  createApartment(@Body() apartmentData: CreateApartmentDto) {
    return this.apartmentService.createApartment(apartmentData);
  }
}

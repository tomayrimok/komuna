import { Body, ConflictException, Controller, NotFoundException, Param, Post, Get, Query } from '@nestjs/common';
import { ApartmentService } from './apartment.service';
import { CreateApartmentDto } from './dto/create-apartment.dto';
import { Apartment } from './apartment.entity';
import { User } from '../user/user.entity';
import { UserApartment } from '../user-apartment/user-apartment.entity';
import { UseAuth } from '../decorators/UseAuth';
import { User as GetUser } from '../decorators/User';
import { UserRole } from '@komuna/types';
import { generateApartmentCode } from '../utils/generateVerificationCode';

@Controller('apartment')
export class ApartmentController {
  constructor(private readonly apartmentService: ApartmentService) { }
  private static readonly CODE_LENGTH = 4;

  @Post()
  @UseAuth()
  async createApartment(@Body() createApartmentData: CreateApartmentDto, @GetUser() user: User) {
    const houseCommitteePayerUser = new User();
    houseCommitteePayerUser.userId = createApartmentData.renterSettings.houseCommitteePayerUserId;

    const userApartment = new UserApartment();
    userApartment.userId = user.userId;
    userApartment.rent = createApartmentData.renterSettings.rent;
    userApartment.role = createApartmentData.apartmentInfo.role;

    const generatedCode = generateApartmentCode(ApartmentController.CODE_LENGTH);
    const apartment = new Apartment();
    apartment.name = createApartmentData.apartmentInfo.name;
    apartment.address = createApartmentData.apartmentInfo.address;
    apartment.city = createApartmentData.apartmentInfo.city;
    apartment.billsDetails = createApartmentData.apartmentSettings.billsDetails;
    apartment.contractEndDate = createApartmentData.apartmentSettings.contractEndDate;
    apartment.contractUrl = createApartmentData.apartmentSettings.contractUrl;
    apartment.rent = createApartmentData.apartmentSettings.rent;
    apartment.houseCommitteeRent = createApartmentData.renterSettings.houseCommitteeRent;
    apartment.houseCommitteePayerUser = houseCommitteePayerUser;
    apartment.residents = [userApartment];
    apartment.code = generatedCode;

    userApartment.apartment = apartment;

    await this.apartmentService.createApartment(apartment);
    return generatedCode;
  }

  @Get()
    async getApartmentUsers(@Query('apartmentId') apartmentId: string) {
        return await this.apartmentService.getApartmentWithResidents(apartmentId);
    }

}

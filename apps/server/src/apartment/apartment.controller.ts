import { Body, ConflictException, Controller, NotFoundException, Param, Post } from '@nestjs/common';
import { ApartmentService } from './apartment.service';
import { CreateApartmentDto } from './dto/create-apartment.dto';
import { Apartment } from './apartment.entity';
import { User } from '../user/user.entity';
import { UserApartment } from '../user-apartment/user-apartment.entity';
import { UseAuth } from '../decorators/UseAuth';
import { User as GetUser } from '../decorators/User';
import { UserRole } from '@komuna/types';
import { generateApartmentCode } from '../utils/generateVerificationCode';

//TODO move to common types
enum RenterPaymentWays {
  Renter = 'renter',
  Equally = 'equally',
  Else = 'else',
}

@Controller('apartment')
export class ApartmentController {
  constructor(private readonly apartmentService: ApartmentService) {}
  private static readonly CODE_LENGTH = 4;

  @Post()
  @UseAuth()
  async createApartment(@Body() createApartmentData: CreateApartmentDto, @GetUser() user: User) {
    // const houseCommitteePayerUser = new User();
    // houseCommitteePayerUser.userId = createApartmentData.renterSettings.houseCommitteePayerUserId === RenterPaymentWays.Equally
    //   ? null
    //   : createApartmentData.renterSettings.houseCommitteePayerUserId === RenterPaymentWays.Renter ?
    //     user.userId
    //     : createApartmentData.renterSettings.houseCommitteePayerUserId || null;

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
    // apartment.houseCommitteePayerUser = houseCommitteePayerUser;
    apartment.residents = [userApartment];
    apartment.code = generatedCode;

    userApartment.apartment = apartment;

    const newApartment = await this.apartmentService.createApartment(apartment);
    return { generatedCode, apartment: newApartment };
  }

  @Post('join/:code')
  @UseAuth()
  async joinApartment(@Param('code') code: string, @GetUser() user: User) {
    const apartment = await this.apartmentService.getApartmentByCode(code);
    if (!apartment) {
      console.error(`Apartment with code ${code} not found. User requesting to join: ${user.userId}`);
      throw new NotFoundException();
    }

    const userApartment = new UserApartment();
    userApartment.userId = user.userId;
    userApartment.rent = apartment.rent;
    userApartment.role = UserRole.LANDLORD;

    if (apartment.residents.some((resident) => resident.userId === user.userId)) {
      console.error(`User ${user.userId} already exists in apartment with code ${code}`);
      throw new ConflictException();
    }

    apartment.residents.push(userApartment);
    await this.apartmentService.updateApartment(apartment.apartmentId, apartment);

    return true;
  }
}

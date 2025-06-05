import { RENTER_PAYMENT_WAYS, UserRole, type CreateApartmentHttpResponse } from '@komuna/types';
import { Body, ConflictException, Controller, Get, NotFoundException, Param, Post, Query } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { UseAuth } from '../decorators/UseAuth';
import { User as GetUser } from '../decorators/User';
import { UserApartment } from '../user-apartment/user-apartment.entity';
import { User } from '../user/user.entity';
import { generateApartmentCode } from '../utils/generateVerificationCode';
import { Apartment } from './apartment.entity';
import { ApartmentService } from './apartment.service';
import { CreateApartmentDto } from './dto/create-apartment.dto';
import { JoinApartmentDto } from './dto/join-apartment.dto';

@Controller('apartment')
export class ApartmentController {
  constructor(private readonly apartmentService: ApartmentService) { }
  private static readonly CODE_LENGTH = 4;

  @Get()
  @ApiOkResponse({ type: Apartment })
  async getApartmentWithResidents(@Query('apartmentId') apartmentId: string): Promise<Apartment> {
    return await this.apartmentService.getApartmentWithResidents(apartmentId);
  }

  @Post()
  @UseAuth()
  async createApartment(@Body() createApartmentData: CreateApartmentDto, @GetUser() user: User): Promise<CreateApartmentHttpResponse> {
    const userApartment = new UserApartment();
    userApartment.userId = user.userId;
    userApartment.rent = createApartmentData.renterSettings.rent;
    userApartment.role = createApartmentData.apartmentInfo.role;

    const houseCommitteePayerUser = this.createHouseCommitteePayerUser(
      createApartmentData,
      user
    );

    const landlordCode = generateApartmentCode(ApartmentController.CODE_LENGTH);
    const roommateCode = generateApartmentCode(ApartmentController.CODE_LENGTH);

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
    apartment.landlordCode = landlordCode;
    apartment.roommateCode = roommateCode;

    const isLandlord = createApartmentData.apartmentInfo.role === UserRole.LANDLORD;
    if (isLandlord) {
      const landlordUser = new User();
      landlordUser.userId = user.userId;
      apartment.landlord = landlordUser;
    }
    else {
      const userApartment = new UserApartment();
      userApartment.userId = user.userId;
      userApartment.rent = createApartmentData.renterSettings.rent;
      userApartment.role = createApartmentData.apartmentInfo.role;
      userApartment.user = user;
      userApartment.apartment = apartment;
      apartment.residents = [userApartment];
    }

    const { apartmentId } = await this.apartmentService.createApartment(apartment);
    return { apartmentId, landlordCode, roommateCode };
  }

  private createHouseCommitteePayerUser(createApartmentData: CreateApartmentDto, renter: User): Apartment["houseCommitteePayerUser"] {
    const paymentWay = createApartmentData.renterSettings.houseCommitteePayerUserId;
    const user = new User();

    if (paymentWay === RENTER_PAYMENT_WAYS.EQUALLY) {
      return null;
    } else if (paymentWay === RENTER_PAYMENT_WAYS.RENTER) {
      user.userId = renter.userId;
    } else {
      user.userId = null; // TODO: get user id of payer!
    }

    return user;
  }

  @Post("join/:code")
  @UseAuth()
  async joinApartment(@Param() { code }: JoinApartmentDto, @GetUser() user: User) { // TODO check validation
    const apartment = code.length ? await this.apartmentService.getApartmentByCode(code) : null;
    console.log('apartment: ', apartment);
    if (!apartment) {
      console.error(`Apartment with code ${code} not found. User requesting to join: ${user.userId}`);
      throw new NotFoundException();
    }

    const isLandlord = apartment.landlordCode === code;
    if (isLandlord) {
      await this.addLandlordToApartment(apartment, user);
    } else {
      await this.addRoommateToApartment(apartment, user);
    }

    return true;
  }

  private addRoommateToApartment(apartment: Apartment, user: User) {
    if (Array.isArray(apartment.residents) && apartment.residents.some(resident => resident.userId === user.userId)) {
      console.error(`User ${user.userId} already exists in apartment with code ${apartment.roommateCode}`);
      throw new ConflictException();
    }
    const userApartment = new UserApartment();
    userApartment.user = user;
    userApartment.userId = user.userId;
    userApartment.apartment = apartment;
    userApartment.apartmentId = apartment.apartmentId;
    userApartment.role = UserRole.ROOMMATE;

    return this.apartmentService.addRoommate(apartment, userApartment);
  }

  private addLandlordToApartment(apartment: Apartment, user: User) {
    if (apartment.landlord) {
      console.error(`User ${user.userId} cannot join apartment with code ${apartment.roommateCode} because it already has a landlord`);
      throw new ConflictException();
    }
    apartment.landlord = new User();
    apartment.landlord.userId = user.userId;
    return this.apartmentService.addLandlord(apartment, apartment.landlord);
  }
}

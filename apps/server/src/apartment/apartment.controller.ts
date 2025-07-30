import { RENTER_PAYMENT_WAYS, UserRole, type CreateApartmentHttpResponse } from '@komuna/types';
import {
  Body,
  ConflictException,
  Controller,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
} from '@nestjs/common';
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
import { UserApartmentService } from '../user-apartment/user-apartment.service';
import { UseAuthApartment } from '../decorators/UseAuthApartment';

@Controller('apartment')
export class ApartmentController {
  constructor(
    private readonly apartmentService: ApartmentService,
    private readonly userApartmentService: UserApartmentService
  ) {}
  private static readonly CODE_LENGTH = 4;

  @Get()
  @ApiOkResponse({ type: Apartment })
  async getApartmentWithResidents(@Query('apartmentId') apartmentId: string): Promise<Apartment> {
    const res = await this.apartmentService.getApartmentWithResidents(apartmentId);
    console.log('res: ', res);
    return res;
  }

  @Post()
  @UseAuth()
  async createApartment(
    @Body() createApartmentData: CreateApartmentDto,
    @GetUser() user: User
  ): Promise<CreateApartmentHttpResponse> {
    const userApartment = new UserApartment();
    userApartment.userId = user.userId;
    userApartment.rent = createApartmentData.renterSettings.rent;
    userApartment.role = createApartmentData.apartmentInfo.role;

    const isLandlord = createApartmentData.apartmentInfo.role === UserRole.LANDLORD;

    const apartment = new Apartment();
    apartment.name = createApartmentData.apartmentInfo.name;
    apartment.address = createApartmentData.apartmentInfo.address;
    apartment.city = createApartmentData.apartmentInfo.city;
    apartment.billsDetails = createApartmentData.apartmentSettings.billsDetails;

    apartment.contractEndDate = createApartmentData.apartmentSettings.contractEndDate
      ? new Date(createApartmentData.apartmentSettings.contractEndDate)
      : null;
    apartment.contractUrl = '';
    // TODO: Handle file upload for contractUrl
    // apartment.contractUrl = createApartmentData.apartmentSettings.contractUrl;
    apartment.rent = createApartmentData.apartmentSettings.rent;

    if (isLandlord) {
      const landlordUser = new User();
      landlordUser.userId = user.userId;
      apartment.landlord = landlordUser;
    } else {
      const userApartment = new UserApartment();
      userApartment.userId = user.userId;
      userApartment.rent = createApartmentData.renterSettings.rent;
      userApartment.role = createApartmentData.apartmentInfo.role;
      userApartment.user = user;
      userApartment.apartment = apartment;

      apartment.residents = [userApartment];
      apartment.houseCommitteeRent = createApartmentData.renterSettings.houseCommitteeRent;
      apartment.houseCommitteePayerUser = this.createHouseCommitteePayerUser(createApartmentData, user);
    }

    if (createApartmentData.apartmentId) {
      // update existing apartment

      const resident = apartment.residents?.find(({ userId }) => userId === user.userId);

      await this.apartmentService.updateApartmentByApartmentId(
        createApartmentData.apartmentId,
        isLandlord,
        resident,
        apartment,
        createApartmentData.renterSettings.payableByUserId === RENTER_PAYMENT_WAYS.RENTER ||
          createApartmentData.renterSettings.payableByUserId === RENTER_PAYMENT_WAYS.ELSE
          ? null
          : createApartmentData.renterSettings.payableByUserId
      );

      return { apartmentId: null, roommateCode: null, landlordCode: null };
    }

    // create new apartment
    const roommateCode = generateApartmentCode(ApartmentController.CODE_LENGTH);
    const landlordCode = isLandlord ? null : generateApartmentCode(ApartmentController.CODE_LENGTH);

    apartment.landlordCode = landlordCode;
    apartment.roommateCode = roommateCode;

    const { apartmentId } = await this.apartmentService.createApartment(apartment);

    return { apartmentId, roommateCode, landlordCode };
  }

  private createHouseCommitteePayerUser(
    createApartmentData: CreateApartmentDto,
    renter: User
  ): Apartment['houseCommitteePayerUser'] {
    const user = new User();

    const paymentWayOrUUID = createApartmentData.renterSettings.houseCommitteePayerUserId;
    if (
      paymentWayOrUUID === RENTER_PAYMENT_WAYS.RENTER ||
      paymentWayOrUUID === RENTER_PAYMENT_WAYS.ELSE ||
      paymentWayOrUUID.length === 0
    ) {
      user.userId = renter.userId;
    } else {
      user.userId = paymentWayOrUUID;
    }

    return user;
  }

  @Post('join/:code')
  @ApiOkResponse({ type: UserApartment })
  @UseAuth()
  async joinApartment(@Param() { code }: JoinApartmentDto, @GetUser() user: User) {
    // TODO check validation
    const apartment = code.length ? await this.apartmentService.getApartmentByCode(code) : null;
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

    const apartmentDetails = await this.userApartmentService.getUserApartment(user.userId, apartment.apartmentId);

    return apartmentDetails;
  }

  @Get('/:apartmentId/roommates')
  @UseAuthApartment()
  async getRoommates(@Param('apartmentId') apartmentId: string) {
    return this.apartmentService.getApartmentWithResidents(apartmentId);
  }

  private addRoommateToApartment(apartment: Apartment, user: User) {
    if (Array.isArray(apartment.residents) && apartment.residents.some((resident) => resident.userId === user.userId)) {
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
      console.error(
        `User ${user.userId} cannot join apartment with code ${apartment.roommateCode} because it already has a landlord`
      );
      throw new ForbiddenException();
    }
    apartment.landlord = new User();
    apartment.landlord.userId = user.userId;
    return this.apartmentService.addLandlord(apartment, apartment.landlord);
  }

  @Get('/:apartmentId/codes')
  @UseAuthApartment()
  async getCodes(@Param('apartmentId') apartmentId: string) {
    return this.apartmentService.getCodes(apartmentId);
  }
}

import { RENTER_PAYMENT_WAYS, UserRole, type CreateApartmentHttpResponse } from '@komuna/types';
import { Body, ConflictException, Controller, NotFoundException, Param, Post } from '@nestjs/common';
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
    apartment.residents = [userApartment];
    apartment.landlordCode = landlordCode;
    apartment.roommateCode = roommateCode;

    userApartment.apartment = apartment;

    await this.apartmentService.createApartment(apartment);
    return { landlordCode, roommateCode };
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
    if (!apartment) {
      console.error(`Apartment with code ${code} not found. User requesting to join: ${user.userId}`);
      throw new NotFoundException();
    }

    const userApartment = new UserApartment();
    userApartment.userId = user.userId;
    userApartment.rent = apartment.rent;
    userApartment.role = UserRole.LANDLORD;

    if (apartment.residents.some(resident => resident.userId === user.userId)) {
      console.error(`User ${user.userId} already exists in apartment with code ${code}`);
      throw new ConflictException();
    }

    apartment.residents.push(userApartment);
    await this.apartmentService.updateApartment(apartment.apartmentId, apartment);

    return true;
  }

}

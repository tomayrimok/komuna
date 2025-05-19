import { UserRole } from '../../enums';
import { ApartmentInfoDto, ApartmentSettingsDto, RenterSettingsDto } from './create-apartment.dto';

export class CreateUserDto {
  phoneNumber: string;

  firstName: string;

  lastName: string;

  image?: string;
}

export type ApartmentDetails = { apartmentId: string } & ApartmentInfoDto & ApartmentSettingsDto & RenterSettingsDto;

export interface Apartment {
  apartment: ApartmentDetails;

  createdAt: string;

  rent: number;

  role: UserRole;

  userId: string;
}

export class UserResponse {
  userId: string;

  phoneNumber: string;

  firstName: string;

  lastName: string;

  image?: string;

  apartments: Apartment[];
}

import { UserRole } from '../../enums';
import { BillsDetails } from '../apartment/bills-details.interface';

export class ApartmentInfoDto {
  name: string;

  address?: string;

  city?: string;

  role: UserRole;
}

export class ApartmentSettingsDto {
  contractEndDate?: Date;

  contractUrl?: string;

  rent?: number;

  billsDetails?: BillsDetails;
}

export class RenterSettingsDto {
  rent?: number;

  payableByUserId?: string;

  houseCommitteeRent?: number;

  houseCommitteePayerUserId?: string;
}

export class CreateApartmentDto {
  apartmentInfo: ApartmentInfoDto;

  apartmentSettings: ApartmentSettingsDto;

  renterSettings: RenterSettingsDto;
}

export type Code = string | number;
export interface CreateApartmentHttpResponse {
  landlordCode: Code;
  roommateCode: Code;
}

export type ApartmentDetails = { apartmentId: string } & ApartmentInfoDto &
  CreateApartmentHttpResponse &
  ApartmentSettingsDto &
  RenterSettingsDto;

export interface Apartment {
  apartment: ApartmentDetails;

  createdAt: string;

  rent: number;

  role: UserRole;

  userId: string;
}

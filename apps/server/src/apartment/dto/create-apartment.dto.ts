import {
  ApartmentInfoDto as BaseApartmentInfoDto,
  ApartmentSettingsDto as BaseApartmentSettingsDto,
  CreateApartmentDto as BaseCreateApartmentDto,
  RenterSettingsDto as BaseRenterSettingsDto,
  RENTER_PAYMENT_WAYS,
  UserRole,
} from '@komuna/types';
import { Transform, Type } from 'class-transformer';
import { IsDate, IsEnum, IsNumber, IsOptional, IsString, ValidateIf, ValidateNested } from 'class-validator';
import { BillsDetailsDto } from './bills-details.dto';

/** First form */
class ApartmentInfoDto implements BaseApartmentInfoDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsEnum(UserRole)
  role: UserRole;
}

/** Second form */
class ApartmentSettingsDto implements BaseApartmentSettingsDto {
  @IsOptional()
  @IsDate()
  @Transform(({ value }) => (value ? new Date(value) : undefined))
  contractEndDate?: Date;

  @IsString()
  @IsOptional()
  contractUrl?: string;

  @IsNumber()
  @Transform(({ value }) => Number(value))
  @IsOptional()
  rent?: number;

  @IsOptional()
  @ValidateNested() // TODO check that this validates
  @Type(() => BillsDetailsDto)
  billsDetails?: BillsDetailsDto;
}

/** Third form */
class RenterSettingsDto implements BaseRenterSettingsDto {
  @IsNumber()
  @Transform(({ value }) => Number(value))
  @IsOptional()
  rent?: number;

  @IsString()
  @IsOptional()
  @ValidateIf(
    (obj, value) =>
      Object.values(RENTER_PAYMENT_WAYS).includes(value) ||
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(value) /// uuid
  )
  payableByUserId?: string;

  @IsNumber()
  @Transform(({ value }) => Number(value))
  @IsOptional()
  houseCommitteeRent?: number;

  @IsString()
  @IsOptional()
  @ValidateIf(
    (obj, value) =>
      Object.values(RENTER_PAYMENT_WAYS).includes(value) ||
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(value) /// uuid
  )
  houseCommitteePayerUserId?: string;
}

export class CreateApartmentDto implements BaseCreateApartmentDto {
  @IsString()
  @IsOptional()
  apartmentId: string;

  @ValidateNested()
  @Type(() => ApartmentInfoDto)
  apartmentInfo: ApartmentInfoDto;

  @ValidateNested()
  @Type(() => ApartmentSettingsDto)
  apartmentSettings: ApartmentSettingsDto;

  @ValidateNested()
  @Type(() => RenterSettingsDto)
  renterSettings: RenterSettingsDto;
}

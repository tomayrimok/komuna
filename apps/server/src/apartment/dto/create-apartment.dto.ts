import {
  ApartmentInfoDto as BaseApartmentInfoDto,
  ApartmentSettingsDto as BaseApartmentSettingsDto,
  CreateApartmentDto as BaseCreateApartmentDto,
  RenterSettingsDto as BaseRenterSettingsDto,
  RENTER_PAYMENT_WAYS,
  UserRole,
} from '@komuna/types';
import { Transform, Type } from 'class-transformer';
import { IsDate, IsEnum, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
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
  @Transform(({ value }) => {
    // The client sends a string in the format 'dd/mm/yyyy'
    if (typeof value === 'string') {
      const [day, month, year] = value.split('/').map(Number);
      return new Date(year, month - 1, day);
    }
    return value;
  })
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
  payableByUserId?: string;

  @IsNumber()
  @Transform(({ value }) => Number(value))
  @IsOptional()
  houseCommitteeRent?: number;

  @IsEnum(RENTER_PAYMENT_WAYS) // TODO check this passes correctly
  @IsOptional()
  houseCommitteePayerUserId?: RENTER_PAYMENT_WAYS;
}

export class CreateApartmentDto implements BaseCreateApartmentDto {
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

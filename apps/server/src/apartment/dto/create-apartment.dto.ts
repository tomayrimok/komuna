import { ApartmentInfoDto as BaseApartmentInfoDto, UserRole } from "@komuna/types";
import { IsDate, IsEnum, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { BillsDetailsDto } from "./bills-details.dto";


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
class ApartmentSettingsDto {
  @IsOptional()
  @IsDate() // TODO: Maybe IsString() with transform to Date
  contractEndDate?: Date;

  @IsString()
  @IsOptional()
  // TODO: depends on how we upload a file
  contractUrl?: string;

  @IsString()
  @IsOptional()
  rent?: number;

  @IsString()
  @IsOptional()
  @ValidateNested() // TODO check that this validates
  billsDetails?: BillsDetailsDto;
}

/** Third form */
class RenterSettingsDto {
  @IsNumber()
  @IsOptional()
  rent?: number;

  @IsString()
  @IsOptional()
  payableByUserId?: string;

  @IsNumber()
  @IsOptional()
  houseCommitteeRent: number;

  @IsString()
  @IsOptional()
  houseCommitteePayerUserId?: string;
}

export class CreateApartmentDto {
  @ValidateNested()
  apartmentInfo: ApartmentInfoDto;

  @ValidateNested()
  apartmentSettings: ApartmentSettingsDto;

  @ValidateNested()
  renterSettings: RenterSettingsDto;
}

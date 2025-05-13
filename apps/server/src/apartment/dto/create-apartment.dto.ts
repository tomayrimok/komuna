import { ApartmentInfoDto as BaseApartmentInfoDto } from "@komuna/types";
import { IsEnum, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
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

  @IsEnum(["renter", "leaser"])
  role: BaseApartmentInfoDto["role"];
}

/** Second form */
class ApartmentSettingsDto {
  @IsString()
  @IsOptional()
  contractEndDate?: string;

  @IsString()
  @IsOptional()
  // TODO: depends on how we upload a file
  contractUrl?: string;

  @IsString()
  @IsOptional()
  totalRent?: number;

  @IsString()
  @IsOptional()
  @ValidateNested() // TODO check that this validates
  billsDetails?: BillsDetailsDto;
}

/** Third form */
class RenterSettingsDto {
  @IsNumber()
  @IsOptional()
  myRent?: number;

  @IsString()
  @IsOptional()
  payableByUserId?: string;

  @IsNumber()
  @IsOptional()
  houseCommitteeRent: number;
}

export class CreateApartmentDto {
  @ValidateNested()
  apartmentInfo: ApartmentInfoDto;

  @ValidateNested()
  apartmentSettings: ApartmentSettingsDto;

  @ValidateNested()
  renterSettings: RenterSettingsDto;
}

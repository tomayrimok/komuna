import type { ApartmentInfoDto as BaseCreateApartmentDto } from "@komuna/types";
import { IsEnum, IsOptional, IsString } from "class-validator";

export class CreateApartmentDto implements BaseCreateApartmentDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsEnum(["renter", "leaser"])
  role: BaseCreateApartmentDto["role"];
}

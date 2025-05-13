import { IsOptional, IsString } from "class-validator";
import type { BillsDetails } from "../apartment.entity";

export class BillsDetailsDto implements BillsDetails {
  @IsString()
  @IsOptional()
  electricity?: string;

  @IsString()
  @IsOptional()
  water?: string;

  @IsString()
  @IsOptional()
  internet?: string;

  @IsString()
  @IsOptional()
  gas?: string;
}

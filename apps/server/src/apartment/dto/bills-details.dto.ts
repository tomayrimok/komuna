import { BillsDetails } from '@komuna/types';
import { IsOptional, IsString } from 'class-validator';

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

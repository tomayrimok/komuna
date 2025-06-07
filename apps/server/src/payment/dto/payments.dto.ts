import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreatePaymentDto {
  @ApiProperty()
  @IsString()
  apartmentId: string;

  @ApiProperty()
  @IsString()
  fromId: string;

  @ApiProperty()
  @IsString()
  toId: string;

  @ApiProperty()
  @IsNumber()
  amount: number;
}

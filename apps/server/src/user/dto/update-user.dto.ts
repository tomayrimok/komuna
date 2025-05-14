import { IsString, IsOptional, IsPhoneNumber } from 'class-validator';
import { CreateUserDto as BaseCreateUserDto } from '@komuna/types';
export class CreateUserDto implements BaseCreateUserDto {
  @IsPhoneNumber(null)
  phoneNumber: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsOptional()
  @IsString()
  image?: string;
}

import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { LoginDto as BaseLoginDto, VerifyPhoneNumberDto as BaseVerifyPhoneNumberDto } from '@komuna/types';

export class LoginDto implements BaseLoginDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;
}

export class VerifyPhoneNumberDto implements BaseVerifyPhoneNumberDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  code: string;
}

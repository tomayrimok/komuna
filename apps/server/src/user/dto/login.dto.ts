import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @ApiProperty({ description: "User's phone number for login" })
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;
}

export class VerifyPhoneNumberDto {
  @ApiProperty({ description: "User's phone number to verify" })
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty({ description: 'Verification code sent to the phone number' })
  @IsString()
  @IsNotEmpty()
  code: string;
}

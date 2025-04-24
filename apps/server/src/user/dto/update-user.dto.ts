import { IsString, IsOptional, IsPhoneNumber } from 'class-validator';

export class UpdateUserDto {

    @IsString()
    userId: string;

    @IsPhoneNumber(null)
    phoneNumber: string;

    @IsString()
    firstName: string;

    @IsString()
    lastName: string;

    @IsOptional()
    @IsString()
    image?: string;

    @IsOptional()
    @IsString()
    verificationCode?: string;

}

import { ApiProperty } from '@nestjs/swagger';
import { User } from '../user.entity';
import { IsOptional } from 'class-validator';
import { IsPhoneNumber, IsString } from 'class-validator';

export class UserResponseDto {
  @ApiProperty({ type: User, nullable: true })
  user?: User | null;
}

export class UserCreatedResponseDto {
  @ApiProperty({ type: User, nullable: true })
  user?: User | null;

  @ApiProperty()
  isUser: boolean;
}

export class CreateUserDto {
  @ApiProperty()
  @IsPhoneNumber(null)
  phoneNumber: string;

  @ApiProperty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsString()
  lastName: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  image?: string;
}

import { IsString } from 'class-validator';

export class JoinApartmentDto {
  @IsString()
  code: string;
}

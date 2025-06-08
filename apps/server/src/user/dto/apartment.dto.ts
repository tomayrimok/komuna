import { ApiProperty } from '@nestjs/swagger';
import { UserApartment } from '../../user-apartment/user-apartment.entity';
import { Apartment } from '../../apartment/apartment.entity';

export class GetApartmentWithResidentsDto {
  @ApiProperty({ description: 'The unique identifier of the apartment' })
  apartmentId: string;
}

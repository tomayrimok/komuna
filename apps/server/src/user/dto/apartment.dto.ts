import { ApiProperty } from '@nestjs/swagger';

export class GetApartmentWithResidentsDto {
  @ApiProperty({ description: 'The unique identifier of the apartment' })
  apartmentId: string;
}

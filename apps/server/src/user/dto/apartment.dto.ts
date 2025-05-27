import { ApiProperty } from "@nestjs/swagger";

export class GetApartmentWithResidentsDto {
    @ApiProperty()
    apartmentId: string;
}
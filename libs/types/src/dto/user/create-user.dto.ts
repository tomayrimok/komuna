import { UserRole } from '../../enums';

export class CreateUserDto {
  phoneNumber: string;

  firstName: string;

  lastName: string;

  image?: string;
}

export interface ApartmentData {
  apartmentId: string;
  name: string;
  //TODO: add more
}

export interface Apartment {
  apartment: ApartmentData;
  createdAt: string;
  rent: number;
  role: UserRole;
  userId: string;
}
export class UserResponse {
  userId: string;

  phoneNumber: string;

  firstName: string;

  lastName: string;

  image?: string;

  apartments: Apartment[];
}

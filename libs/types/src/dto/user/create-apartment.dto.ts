export enum UserRoleName {
  Renter = 'renter',
  Leaser = 'leaser',
}

type UserRole = UserRoleName.Renter | UserRoleName.Leaser;

export class ApartmentInfoDto {
  name: string;

  address?: string;

  city?: string;

  role: UserRole;
}

import { UserRole } from '../../enums';

export class ApartmentInfoDto {
  name: string;

  address?: string;

  city?: string;

  role: UserRole;
}

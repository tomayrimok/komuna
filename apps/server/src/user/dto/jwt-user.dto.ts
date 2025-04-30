import { UserRole } from '@komuna/types';

export type UserJwtPayload = {
  userId: string;
  phoneNumber: string;
  role?: UserRole;
  apartmentId?: string;
};

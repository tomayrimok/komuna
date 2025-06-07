// guards/apartment-access.guard.ts
import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Request } from 'express';
import { UserApartmentService } from '../user-apartment/user-apartment.service'; // or your actual path
import { UserJwtPayload } from '../user/dto/jwt-user.dto';

export interface RequestWithUser extends Request {
  user: UserJwtPayload;
}

@Injectable()
export class ApartmentAccessGuard implements CanActivate {
  constructor(private readonly userApartmentService: UserApartmentService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;
    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }
    const apartmentId = request.params.apartmentId;

    if (!user || !apartmentId) {
      throw new ForbiddenException('Missing user or apartment ID');
    }

    // This method should check if the user belongs to that apartment
    //! It does not check if the user is the landlord!
    const isMember = await this.userApartmentService.isUserInApartment(user.userId, apartmentId);

    if (!isMember) {
      throw new ForbiddenException('Access denied to this apartment');
    }

    return true;
  }
}

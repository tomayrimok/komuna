import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserApartment } from './user-apartment.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserApartmentService {
  constructor(
    @InjectRepository(UserApartment)
    private readonly userApartmentRepo: Repository<UserApartment>
  ) {}

  async createUserApartment(userApartment: Partial<UserApartment>) {
    return await this.userApartmentRepo.save(userApartment);
  }

  //! It does not check if the user is the landlord!
  async isUserInApartment(userId: string, apartmentId: string): Promise<boolean> {
    const resident = await this.userApartmentRepo.findOne({
      where: {
        userId,
        apartmentId,
      },
    });

    return !!resident;
  }

  async getUserApartment(userId: string, apartmentId: string): Promise<UserApartment> {
    return await this.userApartmentRepo.findOne({
      where: {
        userId,
        apartmentId,
      },
      relations: ['apartment'],
    });
  }
}

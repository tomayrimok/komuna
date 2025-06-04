import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRole } from '@komuna/types';
import { NotificationsService } from '../notifications/notifications.service';
import * as admin from 'firebase-admin';
import { UserApartment } from '../user-apartment/user-apartment.entity';
import type { User } from '../user/user.entity';
import { Apartment } from './apartment.entity';

@Injectable()
export class ApartmentService {
  constructor(
    @InjectRepository(Apartment)
    private readonly apartmentRepo: Repository<Apartment>,
  ) { }

  createApartment(apartment: Partial<Apartment>) {
    return this.apartmentRepo.save(apartment);
  }

  async updateApartment(apartmentId: string, apartment: Partial<Apartment>) {
    return await this.apartmentRepo.update({ apartmentId }, apartment);
  }

  public async addRoommate(apartment: Apartment, userApartment: UserApartment) {
    await this.apartmentRepo.manager.insert(UserApartment, userApartment);

    return this.apartmentRepo
      .createQueryBuilder()
      .relation(Apartment, "residents")
      .of(apartment)
      .add(userApartment);
  }

  public async addLandlord(apartment: Apartment, user: User) {
    return this.apartmentRepo
      .createQueryBuilder()
      .relation(Apartment, "landlord")
      .of(apartment)
      .set(user);
  }

  async getApartment(apartmentId: string) {
    return await this.apartmentRepo.findOneBy({ apartmentId });
  }

  async getApartmentWithResidents(apartmentId: string) {
    const apartment = await this.apartmentRepo.findOne({
      where: { apartmentId },
      relations: ['residents', 'residents.user'],
    });

    if (!apartment) {
      throw new Error(`Apartment with ID ${apartmentId} not found`);
    }

    return apartment;
  }

  /**
   * For joining a roommate/landlord to an apartment
   */
  async getApartmentByCode(code: string) {
    return await this.apartmentRepo.createQueryBuilder("apartment")
      .where('apartment.landlordCode = :code OR apartment.roommateCode = :code', { code })
      .leftJoinAndSelect('apartment.residents', 'residents')
      .leftJoinAndSelect('apartment.landlord', 'landlord')
      .getOne();
  }

}

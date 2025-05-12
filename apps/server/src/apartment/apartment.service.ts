import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Apartment } from './apartment.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ApartmentService {
    constructor(
        @InjectRepository(Apartment)
        private readonly apartmentRepo: Repository<Apartment>,
    ) { }

  async createApartment(apartment: Partial<Apartment>) {
    return await this.apartmentRepo.save(apartment);
  }

  async updateApartment(apartmentId: string, apartment: Partial<Apartment>) {
    return await this.apartmentRepo.update({ apartmentId }, apartment);
  }

  async getApartmentWithResidents(apartmentId: string) {
    return await this.apartmentRepo.findOne({
      where: { apartmentId },
      relations: {
        residents: {
          user: true,
        },
      },
    });
  }
}

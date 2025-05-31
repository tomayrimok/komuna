import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Apartment } from './apartment.entity';

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

  async getApartment(apartmentId: string) {
    return await this.apartmentRepo.findOneBy({ apartmentId });
  }

  getApartmentByCode(code: string) {
    return this.apartmentRepo.findOneBy({ code });
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
}

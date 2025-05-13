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

    createApartment(apartment: Partial<Apartment>) {
        return this.apartmentRepo.save(apartment);
    }

    async updateApartment(apartmentId: string, apartment: Partial<Apartment>) {
        return await this.apartmentRepo.update({ apartmentId }, apartment);
    }

    async getApartment(apartmentId: string) {
        return await this.apartmentRepo.findOneBy({ apartmentId });
    }
}

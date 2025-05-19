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
        return await this.apartmentRepo
            .createQueryBuilder('apartment')
            .leftJoinAndSelect('apartment.residents', 'resident')
            .leftJoinAndSelect('resident.user', 'user')
            .where('apartment.apartmentId = :apartmentId', { apartmentId })
            .select([
                'apartment.apartmentId',
                'apartment.name',
                'resident.userId',
                'resident.rent',
                'resident.role',
                'user.userId',
                'user.firstName',
                'user.lastName',
                'user.image',
                'user.phoneNumber',
            ])
            .getOne();
    }

}

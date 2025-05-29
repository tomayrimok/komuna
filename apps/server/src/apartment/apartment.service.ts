import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Apartment } from './apartment.entity';
import { UserApartment } from '../user-apartment/user-apartment.entity';

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

    async addRoommate(apartment: Apartment, userApartment: UserApartment) {
        await this.apartmentRepo.manager.insert(UserApartment, userApartment);

        return this.apartmentRepo
            .createQueryBuilder()
            .relation(Apartment, "residents")
            .of(apartment)
            .add(userApartment);
    }

    async getApartment(apartmentId: string) {
        return await this.apartmentRepo.findOneBy({ apartmentId });
    }

    getApartmentByCode(code: string) {
        return this.apartmentRepo.createQueryBuilder("apartment")
            .where('apartment.landlordCode = :code OR apartment.roommateCode = :code', { code })
            .leftJoinAndSelect('apartment.residents', 'residents')
            .getOne();
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

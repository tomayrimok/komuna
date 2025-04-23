import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserApartment } from './user-apartment.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserApartmentService {
    constructor(
        @InjectRepository(UserApartment)
        private readonly userApartmentRepo: Repository<UserApartment>,
    ) { }

    async createUserApartment(userApartment: Partial<UserApartment>) {
        return await this.userApartmentRepo.save(userApartment);
    }
}

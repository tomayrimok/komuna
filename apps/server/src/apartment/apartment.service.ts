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
        private readonly notificationService: NotificationsService,
    ) { }

    async createApartment(apartment: Partial<Apartment>) {
        return await this.apartmentRepo.save(apartment);
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

    async sendNotification(apartmentId: string, payload: admin.messaging.MessagingPayload, roles: UserRole[], excludeUserId?: string) {
        const apartment = await this.getApartment(apartmentId);
        if (!apartment) return

        const users = apartment.residents.filter(user =>
            roles.includes(user.role) && user.userId !== excludeUserId
        );

        for (const user of users) {
            await this.notificationService.sendNotification(
                user.userId,
                payload
            );
        }

    }

    /**
     * For joining a roommate/landlord to an apartment
     */
    getApartmentByCode(code: string) {
        return this.apartmentRepo.createQueryBuilder("apartment")
            .where('apartment.landlordCode = :code OR apartment.roommateCode = :code', { code })
            .leftJoinAndSelect('apartment.residents', 'residents')
            .leftJoinAndSelect('apartment.landlord', 'landlord')
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

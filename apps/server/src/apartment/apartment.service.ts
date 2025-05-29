import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Apartment } from './apartment.entity';
import { Repository } from 'typeorm';
import { UserRole } from '@komuna/types';
import { NotificationsService } from '../notifications/notifications.service';
import * as admin from 'firebase-admin';

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

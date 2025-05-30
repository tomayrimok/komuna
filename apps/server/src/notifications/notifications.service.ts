import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { Repository } from 'typeorm';
import { NotificationToken } from './notification-token.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class NotificationsService {

    constructor(
        @InjectRepository(NotificationToken)
        private readonly notificationTokenRepo: Repository<NotificationToken>
    ) {
        this.initializeFirebase();
    }

    initializeFirebase() {
        if (!admin.apps.length) {
            admin.initializeApp({
                credential: admin.credential.cert({
                    projectId: process.env.FIREBASE_PROJECT_ID,
                    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
                }),
            });
        }
    }

    saveToken(userId: string, token: string) {
        return this.notificationTokenRepo.save({ userId, token });
    }

    async getToken(userId: string): Promise<string | undefined> {
        const notificationToken = await this.notificationTokenRepo.findOne({ where: { userId } })
        return notificationToken?.token;
    }

    async sendTest(toUser: string) {
        return this.sendNotification(toUser, {
            notification: { title: 'Test Notification', body: 'This is a test notification' },
        });
    }

    async sendNotification(toUser: string, payload: admin.messaging.MessagingPayload) {
        try {

            const token = await this.getToken(toUser);

            if (!token) {
                console.warn(`No FCM token found for user ${toUser}`);
                return;
            };

            const message: admin.messaging.Message = {
                token,
                notification: payload.notification,
                data: payload.data,
            };

            const response = await admin.messaging().send(message);
            return response;
        } catch (error) {
            console.error('Error sending push notification:', error);
            throw error;
        }
    }
}

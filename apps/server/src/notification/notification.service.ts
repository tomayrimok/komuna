import { Cron, CronExpression } from '@nestjs/schedule';
import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { LessThanOrEqual, Repository } from 'typeorm';
import { NotificationToken } from './notification-token.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from './notification.entity';
import { ContextType, UserRole } from '@komuna/types';
import { ApartmentService } from '../apartment/apartment.service';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(NotificationToken)
    private readonly notificationTokenRepo: Repository<NotificationToken>,
    @InjectRepository(Notification)
    private readonly notificationRepo: Repository<Notification>,
    private readonly apartmentService: ApartmentService
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

  @Cron(CronExpression.EVERY_MINUTE)
  async handleCron() {
    const now = new Date();
    const notifications = await this.findScheduledBefore(now);
    notifications.forEach((n) => this.sendNotificationByContextType(n));
  }

  async saveToken(userId: string, token: string) {
    const existingToken = await this.notificationTokenRepo.findOne({ where: { userId } });
    if (existingToken) {
      existingToken.token = token;
      return this.notificationTokenRepo.save(existingToken);
    }
    return this.notificationTokenRepo.save({ userId, token });
  }

  async getToken(userId: string): Promise<string | undefined> {
    const notificationToken = await this.notificationTokenRepo.findOne({ where: { userId } });
    return notificationToken?.token;
  }

  async deleteToken(userId: string) {
    return await this.notificationTokenRepo.delete({ userId });
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
        // console.warn(`No FCM token found for user ${toUser}`);
        return;
      }

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

  async findScheduledBefore(date: Date): Promise<Notification[]> {
    return this.notificationRepo.find({
      where: {
        scheduledAt: LessThanOrEqual(date),
        sent: false,
      },
    });
  }

  async sendNotificationByContextType(notification: Notification) {
    try {
      switch (notification.contextType) {
        case ContextType.APARTMENT:
          await this.sendNotificationToApartment(notification.contextId, notification.payload, notification.roles);
          break;
        case ContextType.USER:
          await this.sendNotification(notification.contextId, notification.payload);
          break;
        default:
          console.warn(`Unknown context type: ${notification.contextType}`);
      }
      notification.sent = true;
      await this.notificationRepo.save(notification);
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  }

  async sendNotificationToApartment(
    apartmentId: string,
    payload: admin.messaging.MessagingPayload,
    roles: UserRole[],
    excludeUserId?: string
  ) {
    const apartment = await this.apartmentService.getApartmentWithResidents(apartmentId);
    if (!apartment) return;

    const userIds =
      apartment.residents
        ?.filter((user) => roles.includes(user.role) && user.userId !== excludeUserId)
        .map((user) => user.userId) || [];

    if (
      roles.includes(UserRole.LANDLORD) &&
      apartment.landlordUserId &&
      !userIds.includes(apartment.landlordUserId) &&
      apartment.landlordUserId !== excludeUserId
    ) {
      userIds.push(apartment.landlordUserId);
    }

    for (const userId of userIds) {
      await this.sendNotification(userId, payload);
    }
  }

  async addNotification(
    contextType: ContextType,
    contextId: string,
    payload: admin.messaging.MessagingPayload,
    roles: UserRole[] = [],
    metadata: Record<string, any> = {}
  ): Promise<Notification> {
    const notification = this.notificationRepo.create({
      contextType,
      contextId,
      payload,
      roles,
      scheduledAt: new Date(),
      metadata,
    });

    return this.notificationRepo.save(notification);
  }

  async deleteNotificationByMetadata(metadata: Record<string, any>): Promise<void> {
    await this.notificationRepo.delete({ metadata });
  }

  async updateNotificationByMetadata(metadata: Record<string, any>, updateData: Partial<Notification>): Promise<void> {
    await this.notificationRepo.update({ metadata }, updateData);
  }
}

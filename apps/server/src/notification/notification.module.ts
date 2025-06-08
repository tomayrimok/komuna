import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationToken } from './notification-token.entity';
import { Notification } from './notification.entity';
import { ApartmentModule } from '../apartment/apartment.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    JwtModule,
    TypeOrmModule.forFeature([NotificationToken, Notification]),
    ApartmentModule,
    ScheduleModule.forRoot(),
  ],
  providers: [NotificationService],
  controllers: [NotificationController],
  exports: [NotificationService],
})
export class NotificationModule {}

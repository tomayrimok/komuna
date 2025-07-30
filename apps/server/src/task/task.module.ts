import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { TaskNotificationService } from './task-notification.service';
import { TaskSchedulerService } from './task-scheduler.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { UserApartmentModule } from '../user-apartment/user-apartment.module';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task]),
    UserModule,
    UserApartmentModule,
    NotificationModule,
    JwtModule
  ],
  providers: [TaskService, TaskNotificationService, TaskSchedulerService],
  controllers: [TaskController],
  exports: [TaskService, TaskNotificationService],
})
export class TaskModule { }

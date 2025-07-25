import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { GeneralTask } from './general-task.entity';
import { GeneralTaskService } from './general-task.service';
import { GeneralTaskController } from './general-task.controller';
import { GeneralTaskSchedulerService } from './general-task-scheduler.service';
import { TaskModule } from '../task/task.module';
import { UserApartmentModule } from '../user-apartment/user-apartment.module';
import { NotificationModule } from '../notification/notification.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([GeneralTask]),
        TaskModule,
        UserApartmentModule,
        NotificationModule,
        JwtModule,
    ],
    providers: [GeneralTaskService, GeneralTaskSchedulerService],
    controllers: [GeneralTaskController],
    exports: [GeneralTaskService],
})
export class GeneralTaskModule { } 
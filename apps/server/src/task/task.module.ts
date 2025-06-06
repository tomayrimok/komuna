import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { UserApartmentModule } from '../user-apartment/user-apartment.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task]),
    UserModule,
    UserApartmentModule,
    UserModule,
    JwtModule
  ],
  providers: [TaskService],
  controllers: [TaskController],
  exports: [TaskService]
})
export class TaskModule {}

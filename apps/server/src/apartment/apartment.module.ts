import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApartmentController } from './apartment.controller';
import { Apartment } from './apartment.entity';
import { ApartmentService } from './apartment.service';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Apartment]),
    JwtModule,
  ],
  controllers: [ApartmentController],
  providers: [ApartmentService],
  exports: [ApartmentService],
})
export class ApartmentModule { }

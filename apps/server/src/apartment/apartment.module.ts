import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApartmentController } from './apartment.controller';
import { Apartment } from './apartment.entity';
import { ApartmentService } from './apartment.service';
import { UserApartmentModule } from '../user-apartment/user-apartment.module';
import { UserApartment } from '../user-apartment/user-apartment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Apartment, UserApartment]), JwtModule, UserApartmentModule],
  controllers: [ApartmentController],
  providers: [ApartmentService],
  exports: [ApartmentService],
})
export class ApartmentModule {}

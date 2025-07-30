import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApartmentController } from './apartment.controller';
import { Apartment } from './apartment.entity';
import { ApartmentService } from './apartment.service';
import { UserApartmentModule } from '../user-apartment/user-apartment.module';

@Module({
  imports: [TypeOrmModule.forFeature([Apartment]), JwtModule, UserApartmentModule],
  controllers: [ApartmentController],
  providers: [ApartmentService],
  exports: [ApartmentService],
})
export class ApartmentModule {}

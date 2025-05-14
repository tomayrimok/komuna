import { Module } from '@nestjs/common';
import { UserApartmentService } from './user-apartment.service';
import { UserApartmentController } from './user-apartment.controller';
import { UserApartment } from './user-apartment.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserApartment]),
  ],
  providers: [UserApartmentService],
  controllers: [UserApartmentController],
})
export class UserApartmentModule { }

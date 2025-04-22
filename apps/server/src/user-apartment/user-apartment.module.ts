import { Module } from '@nestjs/common';
import { UserApartmentService } from './user-apartment.service';
import { UserApartmentController } from './user-apartment.controller';

@Module({
  providers: [UserApartmentService],
  controllers: [UserApartmentController]
})
export class UserApartmentModule {}

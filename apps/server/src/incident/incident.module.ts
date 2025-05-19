import { Module } from '@nestjs/common';
import { IncidentController } from './incident.controller';
import { IncidentService } from './incident.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Incident } from './incident.entity';
import { UserApartmentModule } from '../user-apartment/user-apartment.module';


@Module({
  imports: [
    TypeOrmModule.forFeature([Incident]),
    UserApartmentModule,
  ],
  controllers: [IncidentController],
  providers: [IncidentService]
})
export class IncidentModule { }

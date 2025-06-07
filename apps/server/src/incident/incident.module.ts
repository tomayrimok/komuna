import { Module } from '@nestjs/common';
import { IncidentController } from './incident.controller';
import { IncidentService } from './incident.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Incident, Comment } from './incident.entity';
import { UserApartmentModule } from '../user-apartment/user-apartment.module';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Incident, Comment]),
    UserApartmentModule,
    UserModule,
    JwtModule,
  ],
  controllers: [IncidentController],
  providers: [IncidentService],
  exports: [IncidentService],
})
export class IncidentModule { }

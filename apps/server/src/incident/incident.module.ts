import { Module } from '@nestjs/common';
import { IncidentController } from './incident.controller';
import { IncidentService } from './incident.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Incident, Comment } from './incident.entity';
import { UserApartmentModule } from '../user-apartment/user-apartment.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([Incident, Comment]),
    UserApartmentModule,
    JwtModule.register({
      secret:      process.env.JWT_SECRET || 'changeme',
      signOptions: { expiresIn: '1h' },
    })
  ],
  controllers: [IncidentController],
  providers: [IncidentService]
})
export class IncidentModule { }

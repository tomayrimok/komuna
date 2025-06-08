import { Module } from '@nestjs/common';
import { DebtEdgeController } from './debt-edge.controller';
import { DebtEdgeService } from './debt-edge.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DebtEdge } from './debt-edge.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([DebtEdge]),
    JwtModule
  ],
  controllers: [DebtEdgeController],
  providers: [DebtEdgeService],
  exports: [DebtEdgeService],
})
export class DebtEdgeModule { }

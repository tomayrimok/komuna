import { Module } from '@nestjs/common';
import { DebtEdgeController } from './debt-edge.controller';
import { DebtEdgeService } from './debt-edge.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DebtEdge } from './debt-edge.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([DebtEdge]),
  ],
  controllers: [DebtEdgeController],
  providers: [DebtEdgeService],
  exports: [DebtEdgeService],
})
export class DebtEdgeModule { }

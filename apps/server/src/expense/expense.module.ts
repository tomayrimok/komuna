import { Module } from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { ExpenseController } from './expense.controller';
import { DebtEdgeModule } from '../debt-edge/debt-edge.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Expense } from './expense.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Expense]), DebtEdgeModule],
  providers: [ExpenseService],
  controllers: [ExpenseController],
  exports: [ExpenseService],
})
export class ExpenseModule {}

import { Module } from '@nestjs/common';
import { ExpenseSplitService } from './expense-split.service';
import { ExpenseSplitController } from './expense-split.controller';

@Module({
  providers: [ExpenseSplitService],
  controllers: [ExpenseSplitController]
})
export class ExpenseSplitModule {}

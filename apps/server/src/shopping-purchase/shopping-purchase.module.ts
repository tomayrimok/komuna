import { Module } from '@nestjs/common';
import { ShoppingPurchaseController } from './shopping-purchase.controller';
import { ShoppingPurchaseService } from './shopping-purchase.service';

@Module({
  controllers: [ShoppingPurchaseController],
  providers: [ShoppingPurchaseService],
})
export class ShoppingPurchaseModule {}

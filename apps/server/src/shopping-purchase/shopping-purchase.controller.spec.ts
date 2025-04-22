import { Test, TestingModule } from '@nestjs/testing';
import { ShoppingPurchaseController } from './shopping-purchase.controller';

describe('ShoppingPurchaseController', () => {
  let controller: ShoppingPurchaseController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShoppingPurchaseController],
    }).compile();

    controller = module.get<ShoppingPurchaseController>(ShoppingPurchaseController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

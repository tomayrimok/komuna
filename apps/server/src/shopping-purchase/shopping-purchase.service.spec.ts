import { Test, TestingModule } from '@nestjs/testing';
import { ShoppingPurchaseService } from './shopping-purchase.service';

describe('ShoppingPurchaseService', () => {
  let service: ShoppingPurchaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ShoppingPurchaseService],
    }).compile();

    service = module.get<ShoppingPurchaseService>(ShoppingPurchaseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

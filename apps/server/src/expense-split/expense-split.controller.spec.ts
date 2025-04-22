import { Test, TestingModule } from '@nestjs/testing';
import { ExpenseSplitController } from './expense-split.controller';

describe('ExpenseSplitController', () => {
  let controller: ExpenseSplitController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExpenseSplitController],
    }).compile();

    controller = module.get<ExpenseSplitController>(ExpenseSplitController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

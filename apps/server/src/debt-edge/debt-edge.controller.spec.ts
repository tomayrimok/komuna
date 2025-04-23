import { Test, TestingModule } from '@nestjs/testing';
import { DebtEdgeController } from './debt-edge.controller';

describe('DebtEdgeController', () => {
  let controller: DebtEdgeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DebtEdgeController],
    }).compile();

    controller = module.get<DebtEdgeController>(DebtEdgeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

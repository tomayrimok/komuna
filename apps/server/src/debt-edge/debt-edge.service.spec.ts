import { Test, TestingModule } from '@nestjs/testing';
import { DebtEdgeService } from './debt-edge.service';

describe('DebtEdgeService', () => {
  let service: DebtEdgeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DebtEdgeService],
    }).compile();

    service = module.get<DebtEdgeService>(DebtEdgeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

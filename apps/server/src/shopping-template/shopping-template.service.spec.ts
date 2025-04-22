import { Test, TestingModule } from '@nestjs/testing';
import { ShoppingTemplateService } from './shopping-template.service';

describe('ShoppingTemplateService', () => {
  let service: ShoppingTemplateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ShoppingTemplateService],
    }).compile();

    service = module.get<ShoppingTemplateService>(ShoppingTemplateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

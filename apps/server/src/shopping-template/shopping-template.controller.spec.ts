import { Test, TestingModule } from '@nestjs/testing';
import { ShoppingTemplateController } from './shopping-template.controller';

describe('ShoppingTemplateController', () => {
  let controller: ShoppingTemplateController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShoppingTemplateController],
    }).compile();

    controller = module.get<ShoppingTemplateController>(ShoppingTemplateController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { UserApartmentController } from './user-apartment.controller';

describe('UserApartmentController', () => {
  let controller: UserApartmentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserApartmentController],
    }).compile();

    controller = module.get<UserApartmentController>(UserApartmentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

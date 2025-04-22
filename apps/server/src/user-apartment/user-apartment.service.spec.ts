import { Test, TestingModule } from '@nestjs/testing';
import { UserApartmentService } from './user-apartment.service';

describe('UserApartmentService', () => {
  let service: UserApartmentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserApartmentService],
    }).compile();

    service = module.get<UserApartmentService>(UserApartmentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

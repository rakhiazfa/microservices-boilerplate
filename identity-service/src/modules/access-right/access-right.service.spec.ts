import { Test, TestingModule } from '@nestjs/testing';
import { AccessRightService } from './access-right.service';

describe('AccessRightService', () => {
  let service: AccessRightService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AccessRightService],
    }).compile();

    service = module.get<AccessRightService>(AccessRightService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

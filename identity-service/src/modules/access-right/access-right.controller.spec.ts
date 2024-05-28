import { Test, TestingModule } from '@nestjs/testing';
import { AccessRightController } from './access-right.controller';
import { AccessRightService } from './access-right.service';

describe('AccessRightController', () => {
  let controller: AccessRightController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccessRightController],
      providers: [AccessRightService],
    }).compile();

    controller = module.get<AccessRightController>(AccessRightController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

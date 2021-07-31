import { Test, TestingModule } from '@nestjs/testing';
import { CheckDuplicatedController } from './check-duplicated.controller';

describe('CheckDuplicatedController', () => {
  let controller: CheckDuplicatedController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CheckDuplicatedController],
    }).compile();

    controller = module.get<CheckDuplicatedController>(
      CheckDuplicatedController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

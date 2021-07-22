import { Test, TestingModule } from '@nestjs/testing';
import { HistoryTypeController } from './history-types.controller';

describe('HistoryTypeController', () => {
  let controller: HistoryTypeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HistoryTypeController],
    }).compile();

    controller = module.get<HistoryTypeController>(HistoryTypeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

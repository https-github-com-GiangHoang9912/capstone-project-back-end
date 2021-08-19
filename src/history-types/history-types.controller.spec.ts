import { Test, TestingModule } from '@nestjs/testing';
import { HistoryTypeController } from './history-types.controller';
import * as httpMocks from 'node-mocks-http';
import { HistoryTypeService } from '../services/history-types.service';

describe('HistoryTypeController', () => {
  let controller: HistoryTypeController;
  const mockHistoryType = {
    getHistoryTypes: jest.fn(() => {
      return {
        id: 1,
        historyName: 'Check Duplication',
      };
    }),
  };
  const req = httpMocks.createRequest();
  req.res = httpMocks.createResponse();
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HistoryTypeController],
      providers: [HistoryTypeService],
    })
      .overrideProvider(HistoryTypeService)
      .useValue(mockHistoryType)
      .compile();

    controller = module.get<HistoryTypeController>(HistoryTypeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  it('get all history type', async () => {
    expect(await controller.getHistoryType(req.res)).toEqual(req.res);
    expect(mockHistoryType.getHistoryTypes).toHaveBeenCalled();
  });
});

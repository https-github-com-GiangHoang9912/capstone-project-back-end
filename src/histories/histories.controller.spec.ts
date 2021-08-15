import { Test, TestingModule } from '@nestjs/testing';
import { HistoryController } from './histories.controller';
import * as httpMocks from 'node-mocks-http';
import { HistoryService } from './../services/histories.service';

describe('HistoryController', () => {
  let controller: HistoryController;
  const mockHistory = {
    getHistoryByUserAndType: jest.fn((userId, typeId) => {
      return {
        id: 1,
        typeId: 1,
        description: "history",
        userId:1,
        date: "20/10/2020",
      }
    })

  }
  const req = httpMocks.createRequest();
  req.res = httpMocks.createResponse();
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HistoryController],
      providers: [HistoryService]
    }).overrideProvider(HistoryService)
    .useValue(mockHistory)
    .compile();

    controller = module.get<HistoryController>(HistoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  it('get all history type', async () => {
    expect(await controller.getHistoryType(req.res,"1","1")).toEqual(
      req.res,
    );
    expect(mockHistory.getHistoryByUserAndType).toHaveBeenCalled();
  });
});

import { QuestionBankService } from './../services/question-bank.service';
import { AuthService } from './../auth/auth.service';
import { HistoryService } from '../services/histories.service';
import { CheckDuplicatedService } from './../services/check-duplicated.service';
import { Test, TestingModule } from '@nestjs/testing';
import { CheckDuplicatedController } from './check-duplicated.controller';
import * as httpMocks from 'node-mocks-http';
import { QuestionCheckDuplicatedDto } from '../dto/check-duplicated.dto';

describe('CheckDuplicatedController', () => {
  let controller: CheckDuplicatedController;
  const mockCheckDuplicatedService = {
    checkDuplicated: jest.fn(() => {
      return {};
    }),
    trainingDataWithSentence: jest.fn(() => {
      return {
        data: {},
      };
    }),
    trainingData: jest.fn(() => {
      return;
    }),
  };
  const mockHistoryService = {
    createHistory: jest.fn(() => {}),
  };
  const mockAuthService = {
    verifyToken: jest.fn(() => {
      return {};
    }),
  };

  const mockQuestionBankService = {
    verifyToken: jest.fn(() => {
      return {};
    }),
  };

  const req = httpMocks.createRequest();
  req.res = httpMocks.createResponse();

  beforeEach(async () => {
    req.cookies = {
      token: { jwt_token: '' },
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CheckDuplicatedController],
      providers: [
        CheckDuplicatedService,
        HistoryService,
        AuthService,
        QuestionBankService,
      ],
    })
      .overrideProvider(CheckDuplicatedService)
      .useValue(mockCheckDuplicatedService)
      .overrideProvider(HistoryService)
      .useValue(mockHistoryService)
      .overrideProvider(AuthService)
      .useValue(mockAuthService)
      .overrideProvider(QuestionBankService)
      .useValue(mockQuestionBankService)
      .compile();

    controller = module.get<CheckDuplicatedController>(
      CheckDuplicatedController,
    );
  });

  it('Check-duplicate should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('check duplicate', async () => {
    const question: QuestionCheckDuplicatedDto = {
      question: 'what is database',
    };

    expect(await controller.checkDuplicated(req, question, req.res)).toEqual(
      req.res,
    );

    expect(mockCheckDuplicatedService.checkDuplicated).toHaveBeenCalled();
    expect(mockAuthService.verifyToken).toHaveBeenCalled();
    expect(mockHistoryService.createHistory).toHaveBeenCalled();
  });

  it('Train Duplicated Model With Sentence', async () => {
    const question: QuestionCheckDuplicatedDto = {
      question: 'what is database',
    };

    expect(
      await controller.checkDuplicatedWithSentence(req, question, req.res),
    ).toEqual(req.res);

    expect(
      mockCheckDuplicatedService.trainingDataWithSentence,
    ).toHaveBeenCalled();
    expect(mockAuthService.verifyToken).toHaveBeenCalled();
    expect(mockHistoryService.createHistory).toHaveBeenCalled();
  });

  it('Train Duplicated Model With file dataset role = 2', async () => {
    mockAuthService.verifyToken.mockReturnValue({ role: 2 });

    const mockDataFile = {
      fieldname: 'train',
      originalname: 'train.csv',
      encoding: '7bit',
      mimetype: 'text/csv',
      destination: './uploads/datasets',
      filename: 'train.csv',
      path: 'uploads/datasets/train.csv',
      size: 44,
    };

    expect(await controller.uploadDataset(req, mockDataFile, req.res)).toEqual(
      req.res,
    );

    expect(mockAuthService.verifyToken).toHaveBeenCalled();
    expect(mockCheckDuplicatedService.trainingData).toHaveBeenCalled();
  });

  it('Train Duplicated Model With file dataset role != 2', async () => {
    mockAuthService.verifyToken.mockReturnValue({ role: 3 });

    const mockDataFile = {
      fieldname: 'train',
      originalname: 'train.csv',
      encoding: '7bit',
      mimetype: 'text/csv',
      destination: './uploads/datasets',
      filename: 'train.csv',
      path: 'uploads/datasets/train.csv',
      size: 44,
    };

    expect(await controller.uploadDataset(req, mockDataFile, req.res)).toEqual(
      undefined,
    );

    expect(mockAuthService.verifyToken).toHaveBeenCalled();
    expect(mockCheckDuplicatedService.trainingData).toHaveBeenCalled();
  });
});

import { QuestionBankService } from './../services/question-bank.service';
import { AuthService } from './../auth/auth.service';
import { HistoryService } from '../services/histories.service';
import { CheckDuplicatedService } from './../services/check-duplicated.service';
import { Test, TestingModule } from '@nestjs/testing';
import { CheckDuplicatedController } from './check-duplicated.controller';
import * as httpMocks from 'node-mocks-http';
import { QuestionCheckDuplicatedDto } from '../dto/check-duplicated.dto';
import { SubjectService } from '../services/subjects.service';

describe('CheckDuplicatedController', () => {
  let controller: CheckDuplicatedController;
  const mockCheckDuplicatedService = {
    trainBankWithSubject: jest.fn((listQuestionBank: any) => {}),
    checkDuplicated: jest.fn(() => {
      return {};
    }),
    trainingAllQuestionBank: jest.fn(() => {
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
    getAllQuestionBank: jest.fn(() => {
      return [];
    }),
  };

  const mockSubjectService = {
    getQuestionBankBySubjectId: jest.fn((id: number) => {
      return [];
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
        SubjectService,
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
      .overrideProvider(SubjectService)
      .useValue(mockSubjectService)
      .compile();

    controller = module.get<CheckDuplicatedController>(
      CheckDuplicatedController,
    );
  });

  it('Check-duplicate should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('check duplicate fail', async () => {
    const question: QuestionCheckDuplicatedDto = {
      question: 'what is database',
      subjectId: 1,
    };

    expect(await controller.checkDuplicated(req, question, req.res)).toEqual(
      req.res,
    );
    expect(mockAuthService.verifyToken).toHaveBeenCalled();
    expect(mockHistoryService.createHistory).toHaveBeenCalled();
    expect(mockSubjectService.getQuestionBankBySubjectId).toHaveBeenCalledWith(
      1,
    );
    expect(
      mockCheckDuplicatedService.trainBankWithSubject,
    ).toHaveBeenCalledWith([]);
  });

  it('check duplicate', async () => {
    const question: QuestionCheckDuplicatedDto = {
      question: 'what is database',
      subjectId: 1,
    };
    mockAuthService.verifyToken.mockReturnValue({
      sub: 1,
    });
    mockSubjectService.getQuestionBankBySubjectId.mockReturnValue([]);
    mockCheckDuplicatedService.trainBankWithSubject.mockReturnValue();
    expect(await controller.checkDuplicated(req, question, req.res)).toEqual(
      req.res,
    );
    expect(mockHistoryService.createHistory).toHaveBeenCalled();
    expect(mockSubjectService.getQuestionBankBySubjectId).toHaveBeenCalledWith(
      1,
    );
    expect(
      mockCheckDuplicatedService.trainBankWithSubject,
    ).toHaveBeenCalledWith([]);
  });

  it('Train Duplicated All', async () => {
    const question: QuestionCheckDuplicatedDto = {
      question: 'what is database',
    };

    expect(await controller.checkDuplicatedAll(req, question, req.res)).toEqual(
      req.res,
    );

    expect(mockAuthService.verifyToken).toHaveBeenCalled();
    expect(mockHistoryService.createHistory).toHaveBeenCalled();
    expect(mockQuestionBankService.getAllQuestionBank).toHaveBeenCalled();
    expect(
      mockCheckDuplicatedService.trainingAllQuestionBank,
    ).toHaveBeenCalledWith([]);
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
      undefined,
    );

    expect(mockAuthService.verifyToken).toHaveBeenCalled();
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
  });
});

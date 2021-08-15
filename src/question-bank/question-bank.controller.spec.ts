import { Test, TestingModule } from '@nestjs/testing';
import { QuestionBankController } from './question-bank.controller';
import * as httpMocks from 'node-mocks-http';
import { QuestionBankService } from '../services/question-bank.service';
import { QuestionBankDto } from './../dto/question-bank.dto';

describe('QuestionBankController', () => {
  let controller: QuestionBankController;
  const mockQuestionBank = {
    addQuestionNoDuplicateToBank: jest.fn(() => {
      return {
        id: 1,
        questionText: 'Why normalization is required in OLTP Database',
        subjectId: 1,
      };
    }),
  };

  const req = httpMocks.createRequest();
  req.res = httpMocks.createResponse();
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuestionBankController],
      providers: [QuestionBankService],
    })
      .overrideProvider(QuestionBankService)
      .useValue(mockQuestionBank)
      .compile();

    controller = module.get<QuestionBankController>(QuestionBankController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  it('create question bank', async () => {
    const questionDto: QuestionBankDto = {
      question: 'Why normalization is required in OLTP Database',
      subjectId: 1,
    };
    expect(await controller.createQuestion(req.res, questionDto)).toEqual(
      req.res,
    );
    expect(mockQuestionBank.addQuestionNoDuplicateToBank()).toEqual({
      id: 1,
      questionText: 'Why normalization is required in OLTP Database',
      subjectId: 1,
    });
  });
});

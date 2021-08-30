import { Test, TestingModule } from '@nestjs/testing';
import { QuestionController } from './questions.controller';
import * as httpMocks from 'node-mocks-http';
import { QuestionService } from '../services/questions.service';
import { QuestionDto } from './../dto/question.dto';
import { HistoryService } from '../services/histories.service';

describe('QuestionController', () => {
  let controller: QuestionController;
  const mockQuestion = {
    getQuestionsByExamId: jest.fn(() => {
      return {
        id: 1,
        questionId: 1,
        answerId: 1,
        correct: true,
      };
    }),
    deleteQuestion: jest.fn(() => {
      return;
    }),
    getQuestionDetail: jest.fn(() => {
      return {
        id: 1,
        questionBankId: 1,
        examId: 1,
      };
    }),
    createNewQuestion: jest.fn(() => {
      return {
        id: 1,
        questionBankId: 1,
        examId: 1,
      };
    }),
    updateQuestion: jest.fn(() => {
      return {
        id: 1,
        questionBankId: 1,
        examId: 1,
      };
    }),
  };

  const mockHistoryService = {
    createHistory: jest.fn(() => {}),
  }
  
  const req = httpMocks.createRequest();
  req.res = httpMocks.createResponse();
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuestionController],
      providers: [QuestionService, HistoryService],
    })
      .overrideProvider(QuestionService)
      .useValue(mockQuestion)
      .overrideProvider(HistoryService)
      .useValue(mockHistoryService)
      .compile();

    controller = module.get<QuestionController>(QuestionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  it('get question by Exam', async () => {
    expect(await controller.getQuestionByExamId(req.res, 1)).toEqual(req.res);
    expect(mockQuestion.getQuestionsByExamId).toHaveBeenCalled();
  });
  it('delete question', async () => {
    expect(await controller.deleteQuestionById(req.res, 1)).toEqual(req.res);
    expect(mockQuestion.deleteQuestion).toHaveBeenCalled();
  });
  it('get question detail', async () => {
    expect(await controller.getQuestionDetail(req.res, 1)).toEqual(req.res);
    expect(mockQuestion.getQuestionDetail).toHaveBeenCalled();
  });
  it('update question', async () => {
    const questionDto: QuestionDto = {
      questionBankId: [1, 2, 3],
      examId: 1,
    };
    expect(await controller.updateQuestion(req.res, questionDto, 1)).toEqual(
      req.res,
    );
    expect(mockQuestion.updateQuestion).toHaveBeenCalled();
  });

  it('create question', async () => {
    const questionDtos: QuestionDto = {};
    expect(await controller.createQuestion(req.res, 1, questionDtos)).toEqual(
      req.res,
    );
  });
});

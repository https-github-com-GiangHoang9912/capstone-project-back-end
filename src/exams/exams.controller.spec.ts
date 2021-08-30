import { QuestionModule } from './../questions/questions.module';
import { Test, TestingModule } from '@nestjs/testing';
import { ExamController } from './exams.controller';
import * as httpMocks from 'node-mocks-http';
import { ExamInfoDto } from './../dto/create-exam.dto';
import { ExamService } from '../services/exams.service';
import { QuestionBankService } from '../services/question-bank.service';
import { QuestionService } from '../services/questions.service';
import { QuestionBank } from '../entities/question-bank.entity';
import { HistoryService } from '../services/histories.service';

describe('ExamController', () => {
  let controller: ExamController;

  const mockExamService = {
    getExamAndSubjectByUser: jest.fn((id) => {
      return [];
    }),
    searchExamByName: jest.fn((id, examName) => {
      return [];
    }),
    deleteExam: jest.fn((id) => {
      return;
    }),
    createExam: jest.fn((subjectId, examName, userId) => {
      return {};
    }),
  };
  const mockQuestionBank = {
    getQuestionBankBySubjectId: jest.fn((subjectId) => {
      return [
        {
          id: 1,
          questionText: '',
          subjectId: 1,
        },
        {
          id: 2,
          questionText: '',
          subjectId: 1,
        },
        {
          id: 3,
          questionText: '',
          subjectId: 1,
        },
        {
          id: 4,
          questionText: '',
          subjectId: 1,
        },
        {
          id: 5,
          questionText: '',
          subjectId: 1,
        },
        {
          id: 6,
          questionText: '',
          subjectId: 1,
        },
        {
          id: 7,
          questionText: '',
          subjectId: 1,
        },
        {
          id: 8,
          questionText: '',
          subjectId: 1,
        },
        {
          id: 9,
          questionText: '',
          subjectId: 1,
        },
        {
          id: 10,
          questionText: '',
          subjectId: 1,
        },
        {
          id: 11,
          questionText: '',
          subjectId: 1,
        },
        {
          id: 12,
          questionText: '',
          subjectId: 1,
        },
        {
          id: 13,
          questionText: '',
          subjectId: 1,
        },
        {
          id: 14,
          questionText: '',
          subjectId: 1,
        },
        {
          id: 15,
          questionText: '',
          subjectId: 1,
        },
      ];
    }),
  };
  const mockQuestion = {
    createQuestion: jest.fn((question, exam) => {
      return {};
    }),
  };

  const mockHistoryService = {
    createHistory: jest.fn(() => {}),
  }

  const req = httpMocks.createRequest();
  req.res = httpMocks.createResponse();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExamController],
      providers: [ExamService, QuestionBankService, QuestionService, HistoryService],
    })
      .overrideProvider(ExamService)
      .useValue(mockExamService)
      .overrideProvider(QuestionBankService)
      .useValue(mockQuestionBank)
      .overrideProvider(QuestionService)
      .useValue(mockQuestion)
      .overrideProvider(HistoryService)
      .useValue(mockHistoryService)
      .compile();

    controller = module.get<ExamController>(ExamController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('get all exam by user', async () => {
    expect(await controller.getExamAndSubjectByUser(req.res, 1)).toEqual(
      req.res,
    );

    expect(mockExamService.getExamAndSubjectByUser).toHaveBeenCalled();
  });

  it('search exam by name', async () => {
    expect(await controller.searchExamByName(req.res, 1, 'test_1')).toEqual(
      req.res,
    );

    expect(mockExamService.searchExamByName).toHaveBeenCalled();
  });

  it('delete exam by id', async () => {
    expect(await controller.deleteExamById(req.res, 1)).toEqual(req.res);

    expect(mockExamService.deleteExam).toHaveBeenCalled();
  });

  it('create exam', async () => {
    const examInfo: ExamInfoDto = {
      subjectId: 1,
      examName: 'test_1',
    };

    const question_bank: any = [
      {
        id: 1,
        questionText: '',
        subjectId: 1,
      },
      {
        id: 2,
        questionText: '',
        subjectId: 1,
      },
      {
        id: 3,
        questionText: '',
        subjectId: 1,
      },
      {
        id: 4,
        questionText: '',
        subjectId: 1,
      },
      {
        id: 5,
        questionText: '',
        subjectId: 1,
      },
      {
        id: 6,
        questionText: '',
        subjectId: 1,
      },
      {
        id: 7,
        questionText: '',
        subjectId: 1,
      },
      {
        id: 8,
        questionText: '',
        subjectId: 1,
      },
      {
        id: 9,
        questionText: '',
        subjectId: 1,
      },
      {
        id: 10,
        questionText: '',
        subjectId: 1,
      },
      {
        id: 11,
        questionText: '',
        subjectId: 1,
      },
      {
        id: 12,
        questionText: '',
        subjectId: 1,
      },
      {
        id: 13,
        questionText: '',
        subjectId: 1,
      },
      {
        id: 14,
        questionText: '',
        subjectId: 1,
      },
      {
        id: 15,
        questionText: '',
        subjectId: 1,
      },
    ];

    expect(controller.getRandom(question_bank, 10)).toEqual([
      { id: expect.any(Number), questionText: '', subjectId: 1 },
      { id: expect.any(Number), questionText: '', subjectId: 1 },
      { id: expect.any(Number), questionText: '', subjectId: 1 },
      { id: expect.any(Number), questionText: '', subjectId: 1 },
      { id: expect.any(Number), questionText: '', subjectId: 1 },
      { id: expect.any(Number), questionText: '', subjectId: 1 },
      { id: expect.any(Number), questionText: '', subjectId: 1 },
      { id: expect.any(Number), questionText: '', subjectId: 1 },
      { id: expect.any(Number), questionText: '', subjectId: 1 },
      { id: expect.any(Number), questionText: '', subjectId: 1 },
    ]);

    expect(await controller.createExam(req.res, examInfo, 1)).toEqual(req.res);

    expect(mockQuestionBank.getQuestionBankBySubjectId).toHaveBeenCalled();
  });
});

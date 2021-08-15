import { Test, TestingModule } from '@nestjs/testing';
import { ExamController } from './exams.controller';
import * as httpMocks from 'node-mocks-http';
import { ExamInfoDto } from './../dto/create-exam.dto';
import { ExamService } from '../services/exams.service';
import {QuestionBankService} from '../services/question-bank.service'
import {QuestionService} from '../services/questions.service'
describe('ExamController', () => {
  let controller: ExamController;

  const mockExamService = {
    getExamAndSubjectbyUser: jest.fn((id) => {
      return;
    }),
    searchExamByName: jest.fn((id, examName) => {
      return;
    }),
    deleteExamById: jest.fn((id) => {
      return;
    }),
    createExam: jest.fn(() => {
      return;
    }),
  };
  const mockQuestionBank ={
    getQuestionBankBySubjectId: jest.fn(() =>{
      return;
    })
  }
  const req = httpMocks.createRequest();
  req.res = httpMocks.createResponse();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExamController],
      providers: [ExamService,QuestionBankService,QuestionService],
    })
      .overrideProvider(ExamService)
      .useValue(mockExamService)
      .overrideProvider(QuestionBankService)
      .useValue(mockQuestionBank)
      .compile();

    controller = module.get<ExamController>(ExamController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('get all exam by user', () => {
    expect(controller.getExamAndSubjectbyUser(req.res, 1)).toEqual(req.res);

    expect(mockExamService.getExamAndSubjectbyUser).toHaveBeenCalled();
  });
});

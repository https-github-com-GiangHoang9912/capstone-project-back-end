import { Test, TestingModule } from '@nestjs/testing';
import { SubjectController } from './subjects.controller';
import * as httpMocks from 'node-mocks-http';
import { SubjectService } from './../services/subjects.service';

describe('SubjectController', () => {
  let controller: SubjectController;

  const mockSubjectService = {
    getSubject: jest.fn(() => {
      return;
    }),

    getQuestionBankBySubjectId: jest.fn((id) => {
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
      controllers: [SubjectController],
      providers: [SubjectService],
    })
      .overrideProvider(SubjectService)
      .useValue(mockSubjectService)
      .compile();

    controller = module.get<SubjectController>(SubjectController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('get all subject', async () => {
    expect(await controller.getSubject(req.res)).toEqual(req.res);
    expect(mockSubjectService.getSubject).toHaveBeenCalled();
  });

  it('get exam and subject', async () => {
    expect(await controller.getExamAndSubjectbyUser(req.res, 1)).toEqual(
      req.res,
    );
    expect(mockSubjectService.getQuestionBankBySubjectId(1)).toEqual({
      id: 1,
      questionText: 'Why normalization is required in OLTP Database',
      subjectId: 1,
    });
  });
});

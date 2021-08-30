import { Test, TestingModule } from '@nestjs/testing';
import { AnswerGroupService } from '../services/answers-groups.service';
import { AnswerGroupController } from './answers-groups.controller';
import * as httpMocks from 'node-mocks-http';
import { AnswerGroupDto } from '../dto/answer-group.dto';

describe('QuestionController', () => {
  let controller: AnswerGroupController;

  const mockAnswerGroupService = {
    getAnswersGroups: jest.fn(() => {
      return [];
    }),
    getAnswersGroupsById: jest.fn(() => {
      return {};
    }),
    deleteAnswerGroup: jest.fn(() => {
      return {};
    }),
    createAnswerGroup: jest.fn(() => {
      return {};
    }),
    createAnswerGroupMultiple: jest.fn(() => {
      return {};
    }),
    updateAnswerGroupTrueFalse: jest.fn(() => {
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
      controllers: [AnswerGroupController],
      providers: [AnswerGroupService],
    })
      .overrideProvider(AnswerGroupService)
      .useValue(mockAnswerGroupService)
      .compile();

    controller = module.get<AnswerGroupController>(AnswerGroupController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('Get Answers Groups', async () => {
    expect(await controller.getAnswersGroups(req.res)).toEqual(req.res);
    expect(mockAnswerGroupService.getAnswersGroups).toBeCalled();
  });

  it('Get Answers Groups By Id', async () => {
    expect(await controller.getAnswersGroupsById(req.res, 1)).toEqual(req.res);
    expect(mockAnswerGroupService.getAnswersGroups).toBeCalled();
  });

  it('Create Answer Group tf', async () => {
    const dataQuestion = {
      currentQuestionAnswerGroup: [
        {
          answerId: 1,
          correct: true,
          answer: {
            answerText: 'True',
          },
        },
      ],
      valueTypeAnswer: 'tf',
      userId: 1,
    };

    await controller.createAnswerGroup(req.res, 1, dataQuestion);

    expect(mockAnswerGroupService.deleteAnswerGroup).toBeCalledWith(1);

    expect(mockAnswerGroupService.createAnswerGroup).toBeCalled();
  });

  it('Create Answer Group multi', async () => {
    const dataQuestion = {
      currentQuestionAnswerGroup: [
        {
          answerId: 1,
          correct: true,
          answer: {
            answerText: 'True',
          },
        },
      ],
      valueTypeAnswer: 'multi',
      userId: 1,
    };

    await controller.createAnswerGroup(req.res, 1, dataQuestion);

    expect(mockAnswerGroupService.deleteAnswerGroup).toBeCalledWith(1);

    expect(mockAnswerGroupService.createAnswerGroupMultiple).toBeCalled();
  });
});

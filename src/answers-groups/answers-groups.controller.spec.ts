import { Test, TestingModule } from '@nestjs/testing';
import { AnswerGroupController } from './answers-groups.controller';

describe('QuestionController', () => {
  let controller: AnswerGroupController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnswerGroupController],
    }).compile();

    controller = module.get<AnswerGroupController>(AnswerGroupController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

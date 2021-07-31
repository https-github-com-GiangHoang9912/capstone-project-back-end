import { Test, TestingModule } from '@nestjs/testing';
import { QuestionBankController } from './question-bank.controller';

describe('QuestionBankController', () => {
  let controller: QuestionBankController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuestionBankController],
    }).compile();

    controller = module.get<QuestionBankController>(QuestionBankController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

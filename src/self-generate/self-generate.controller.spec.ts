import { SelfGenerateService } from './../services/self-generate.service';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth/auth.service';
import { HistoryService } from '../services/histories.service';
import { SelfGenerateController } from './self-generate.controller';
import { SelfGenerationDto } from '../dto/self-generation.dto';
import * as httpMocks from 'node-mocks-http';

describe('SelfGenerateController', () => {
  let controller: SelfGenerateController;

  const mockGenerateService = {
    generationQuestions: jest.fn(() => {
      return '';
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

  const req = httpMocks.createRequest();
  req.res = httpMocks.createResponse();

  beforeEach(async () => {
    req.cookies = {
      token: { jwt_token: '' },
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [SelfGenerateController],
      providers: [SelfGenerateService, HistoryService, AuthService],
    })
      .overrideProvider(SelfGenerateService)
      .useValue(mockGenerateService)
      .overrideProvider(HistoryService)
      .useValue(mockHistoryService)
      .overrideProvider(AuthService)
      .useValue(mockAuthService)
      .compile();

    controller = module.get<SelfGenerateController>(SelfGenerateController);
  });

  it('self-generation be defined', () => {
    expect(controller).toBeDefined();
  });

  it('self-generation question', async () => {
    const selfGenerationDto: SelfGenerationDto[] = [
      {
        answer: 'admin',
        context: 'admin is a teacher',
      },
    ];

    expect(
      await controller.selfGenerate(req, selfGenerationDto, req.res),
    ).toEqual(req.res);

    expect(mockGenerateService.generationQuestions).toHaveBeenCalled();
    expect(mockAuthService.verifyToken).toHaveBeenCalled();
    expect(mockHistoryService.createHistory).toHaveBeenCalled();
  });
});

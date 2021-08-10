import { AppController } from './../src/app.controller';
import { AuthService } from './../src/auth/auth.service';
import { Test, TestingModule } from '@nestjs/testing';
import * as httpMocks from 'node-mocks-http';

const app = 'http://localhost:3001';

describe('Auth', () => {
  let authService: AuthService;
  let appController : AppController;

  const req = httpMocks.createRequest();
  req.res = httpMocks.createResponse();

  const mockAuth = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppController],
      providers: [AuthService],
    })
      .overrideProvider(AuthService)
      .useValue(mockAuth)
      .compile();

      authService = module.get<AuthService>(AuthService);
      appController = module.get<AppController>(AppController);
  });

  it('should be login', () => {
    expect(appController.login(req, req.res)).toHaveBeenCalled()
  });
});

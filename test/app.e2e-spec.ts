import { UserService } from './../src/services/users.service';
import { AppController } from './../src/app.controller';
import { AuthService } from './../src/auth/auth.service';
import { Test, TestingModule } from '@nestjs/testing';
import * as httpMocks from 'node-mocks-http';

const app = 'http://localhost:3001';

describe('Auth', () => {
  let authService: AuthService;
  let appController: AppController;

  const req = httpMocks.createRequest();
  req.res = httpMocks.createResponse();

  const mockAuthService = {};
  const userService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppController],
      providers: [AuthService, UserService],
    })
      .overrideProvider(AuthService)
      .useValue(mockAuthService)
      .overrideProvider(UserService)
      .useValue(userService)
      .compile();

    authService = module.get<AuthService>(AuthService);
    appController = module.get<AppController>(AppController);
  });

  it('should be login', () => {
    expect(appController.login(req, req.res)).toHaveBeenCalled();
  });
});

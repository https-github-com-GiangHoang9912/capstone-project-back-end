import { AuthService } from './../src/auth/auth.service';
import { Test, TestingModule } from '@nestjs/testing';
import * as httpMocks from 'node-mocks-http';

const app = 'http://localhost:3001';

describe('Auth', () => {
  let authService: AuthService;

  const req = httpMocks.createRequest();
  req.res = httpMocks.createResponse();

  const mockAuth = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService],
    })
      .overrideProvider(AuthService)
      .useValue(mockAuth)
      .compile();

      authService = module.get<AuthService>(AuthService);
  });

  it('should be login', () => {
  });
});

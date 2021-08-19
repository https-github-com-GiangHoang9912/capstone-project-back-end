import { UserService } from './services/users.service';
import { MailService } from './services/mail.service';
import { AuthService } from './auth/auth.service';
import { AppController } from './app.controller';
import * as httpMocks from 'node-mocks-http';
import { Test, TestingModule } from '@nestjs/testing';

describe('SelfGenerateController', () => {
  let controller: AppController;

  const mockAuthService = {
    login: jest.fn(() => {
      return {
        access_token: '',
        refresh_token: '',
        account: {
          id: 1,
          role: 1,
          username: '',
          profile: {},
        },
      };
    }),
    loginGoogle: jest.fn(() => {
      return {
        access_token: '',
        refresh_token: '',
        account: {
          id: 1,
          role: 1,
          username: '',
          profile: {},
        },
      };
    }),
    getJwtToken: jest.fn(() => {
      return '';
    }),
    getRefreshToken: jest.fn(() => {
      return '';
    }),
  };
  const mockMailService = {
    sendGoogleEmail: jest.fn(() => {
      return {};
    }),
    sendGoogleEmailForgot: jest.fn(() => {
      return {};
    }),
  };
  const mockUserService = {
    forgotPassword: jest.fn((email: string) => {
      return {
        password: '12345678',
        user: {},
      };
    }),
    getUserByEmail: jest.fn(() => {
      return {};
    }),
  };

  const req = httpMocks.createRequest();
  req.res = httpMocks.createResponse();

  beforeEach(async () => {
    req.cookies = {
      token: { jwt_token: '' },
    };

    req.body.id = 1;

    req.body.email = 'admin@gmail.com';

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AuthService, MailService, UserService],
    })
      .overrideProvider(AuthService)
      .useValue(mockAuthService)
      .overrideProvider(MailService)
      .useValue(mockMailService)
      .overrideProvider(UserService)
      .useValue(mockUserService)
      .compile();

    controller = module.get<AppController>(AppController);
  });

  it('App controller be defined', () => {
    expect(controller).toBeDefined();
  });

  it('Forgot Password', async () => {
    expect(
      await controller.forgotPassword(req.res, {
        email: 'admin@gmail.com',
      }),
    ).toEqual(undefined);

    expect(mockUserService.forgotPassword).toHaveBeenCalledWith(
      'admin@gmail.com',
    );
    expect(mockMailService.sendGoogleEmail).toHaveBeenCalled();
  });

  it('login with username and password', async () => {
    expect(await controller.login(req, req.res)).toEqual(req.res);

    expect(mockAuthService.login).toHaveBeenCalledWith(req);
  });

  it('login with google', async () => {
    expect(await controller.loginByGoogle(req, req.res)).toEqual(req.res);

    expect(mockAuthService.loginGoogle).toHaveBeenCalledWith(req);
  });

  it('Refresh Jwt Token', async () => {
    expect(await controller.refreshJwtToken(req, req.res)).toEqual(req.res);

    expect(mockAuthService.getJwtToken).toHaveBeenCalledWith(req.body.id);
    expect(mockAuthService.getRefreshToken).toHaveBeenCalledWith(req.body.id);
  });

  it('Logout', async () => {
    expect(await controller.logout(req.res)).toEqual(req.res);
  });

  it('verify user', async () => {
    expect(await controller.verifyUser(req, req.res)).toEqual(req.res);

    expect(mockUserService.getUserByEmail).toHaveBeenCalledWith(req.body.email);
    expect(mockMailService.sendGoogleEmailForgot).toHaveBeenCalled();
  });

  it('verify user mail is null', async () => {
    mockUserService.getUserByEmail.mockReturnValue(null);

    expect(await controller.verifyUser(req, req.res)).toEqual(req.res);

    expect(mockUserService.getUserByEmail).toHaveBeenCalledWith(req.body.email);
    expect(mockMailService.sendGoogleEmailForgot).toHaveBeenCalled();
  });
});

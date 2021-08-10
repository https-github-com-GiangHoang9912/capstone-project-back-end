import { Exception } from 'handlebars';
import { UserService } from '../services/users.service';
import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './users.controller';
import { HistoryService } from '../services/histories.service';
import * as httpMocks from 'node-mocks-http';
import { CreateUserDto } from '../dto/users.dto';

describe('UserController', () => {
  let controller: UserController;

  const mockUserService = {
    getAllUsers: jest.fn(() => {
      return [
        {
          id: 1,
          username: 'admin',
        },
      ];
    }),
    searchUserByName: jest.fn((username) => {
      return;
    }),
    getUserById: jest.fn((id) => {
      return {
        id: 1,
        username: 'admin',
      };
    }),
    insertUser: jest.fn(() => {
      return {
        id: 1,
        username: 'admin',
        password: '12345678',
      };
    }),
    updateUserInformation: jest.fn(() => {}),
  };
  const mockHistoryService = {
    createHistory: jest.fn(() => {}),
  };
  const req = httpMocks.createRequest();
  req.res = httpMocks.createResponse();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService, HistoryService],
    })
      .overrideProvider(UserService)
      .useValue(mockUserService)
      .overrideProvider(HistoryService)
      .useValue(mockHistoryService)
      .compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('get all users', () => {
    expect(controller.getAllUsers()).toEqual([
      {
        id: expect.any(Number),
        username: 'admin',
      },
    ]);

    expect(mockUserService.getAllUsers).toHaveBeenCalled();
  });

  it('search users', async () => {
    expect(await controller.searchUserByName(req.res, 'admin')).toEqual(
      req.res,
    );
    expect(mockUserService.searchUserByName).toHaveBeenCalled();
  });

  it('get user with id', async () => {
    expect(await controller.getUserById(1)).toEqual({
      id: 1,
      username: 'admin',
    });
    expect(mockUserService.getUserById).toHaveBeenCalledWith(1);
  });

  it('create user', async () => {
    const userDto: CreateUserDto = {
      userName: 'admin',
      password: '12345678',
      email: 'admin@gmail.com',
    };
    expect(await controller.createUser(userDto)).toEqual({
      id: expect.any(Number),
      username: 'admin',
      password: '12345678',
    });

    expect(mockUserService.insertUser).toHaveBeenCalledWith(userDto);
  });
});

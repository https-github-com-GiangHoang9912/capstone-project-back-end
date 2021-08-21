import { RoleUser } from './../dto/role-user.dto';
import { UserService } from '../services/users.service';
import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './users.controller';
import { HistoryService } from '../services/histories.service';
import * as httpMocks from 'node-mocks-http';
import { CreateUserDto } from '../dto/users.dto';
import { GetInformationDto } from '../dto/get-info.dto';
import { UpdateInformationDto } from '../dto/update-infomation.dto';
import { ActiveUser } from '../dto/active-user.dto';
import { ChangePasswordDto } from 'src/dto/change-password.dto';

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
    getUserByName: jest.fn(() => {
      return {
        id: 1,
        username: 'admin',
        password: '12345678',
        contactInfo: {
          id: 1,
          firstName: 'admin',
          email: 'admin@gmail.com',
          ownerId: 1,
        },
      };
    }),
    updateUserInformation: jest.fn(() => {
      return {
        id: 1,
        firstName: 'admin',
        email: 'admin@gmail.com',
        ownerId: 1,
      };
    }),
    updateUserActive: jest.fn(() => {
      return {
        id: 1,
        username: 'admin',
        password: '12345678',
      };
    }),
    updateUserRole: jest.fn(() => {
      return {
        id: 1,
        username: 'admin',
        password: '12345678',
      };
    }),
    changePassword: jest.fn(() => {
      return {
        status: 200,
        message: 'Change Password Successful',
      };
    }),
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

  it('get information of user', async () => {
    const info: GetInformationDto = {
      username: 'admin',
    };

    expect(await controller.getInformation(info)).toEqual({
      id: 1,
      firstName: 'admin',
      email: 'admin@gmail.com',
      ownerId: 1,
    });

    expect(mockUserService.getUserByName).toHaveBeenCalledWith(info.username);
  });

  it('update information of user', async () => {
    const info: UpdateInformationDto = {
      id: 1,
      email: 'admin@gmail.com',
    };

    expect(await controller.updateInformation(info)).toEqual({
      id: 1,
      firstName: 'admin',
      email: 'admin@gmail.com',
      ownerId: 1,
    });
    expect(mockHistoryService.createHistory).toHaveBeenCalled();
    expect(mockUserService.updateUserInformation).toHaveBeenCalledWith(info);
  });

  it('update active user', async () => {
    const userActive: ActiveUser = {
      id: 1,
      active: true,
    };

    expect(await controller.updateActive(userActive)).toEqual({
      id: 1,
      username: 'admin',
      password: '12345678',
    });

    expect(mockUserService.updateUserActive).toHaveBeenCalledWith(userActive);
  });

  it('update role user', async () => {
    const roleUser: RoleUser = {
      roleId: 1,
      roleValue: '1',
    };

    expect(await controller.updateRole(roleUser)).toEqual({
      id: 1,
      username: 'admin',
      password: '12345678',
    });

    expect(mockUserService.updateUserRole).toHaveBeenCalledWith(roleUser);
  });

  it('change password', async () => {
    const changePassword: ChangePasswordDto = {
      userId: 1,
      oldPassword: '12345678',
      newPassword: '87654321',
    };

    expect(await controller.changePassword(changePassword, req.res)).toEqual(
      req.res,
    );

    expect(mockHistoryService.createHistory).toHaveBeenCalled();
    expect(mockUserService.changePassword).toHaveBeenCalledWith(changePassword);
  });
});

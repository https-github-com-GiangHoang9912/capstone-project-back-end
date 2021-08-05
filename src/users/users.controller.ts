import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  UseGuards,
  Res,
  Param,
  HttpStatus,
} from '@nestjs/common';
import { User } from '../entities/users.entity';
import { UserService } from '../services/users.service';
import { CreateUserDto } from '../dto/users.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ContactInfo } from 'src/entities/contactInfo.entity';
import { GetInformationDto } from 'src/dto/get-info.dto';
import { Response } from 'express';
import { UpdateInformationDto } from 'src/dto/update-infomation.dto';
import * as moment from 'moment';
import { HistoryService } from 'src/services/histories.service';
import { AuthService } from 'src/auth/auth.service';
import * as CONSTANTS from '../constant';
import { ChangePasswordDto } from 'src/dto/change-password.dto';

@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly historyService: HistoryService,
  ) {}

  @Get()
  getUsers(): Promise<User[]> {
    return this.userService.getUsers();
  }
  @Get('/users')
  getAllUsers(): Promise<User[]> {
    return this.userService.getAllUsers();
  }
  // @Get(':id')
  // getPostById(@Param('id') id: string) {
  //   return this.userService.getUserById(id);
  // }
  @Get('/:search/')
  async searchUserByName(
    @Res() res: Response,
    @Param('search') username: string,
  ): Promise<any> {
    try {
      const data = await this.userService.searchUserByName(username);
      return res.status(HttpStatus.OK).send(data);
    } catch (error) {}
  }

  @Get('/role/:id/')
  getUserById(@Param('id') id: number): Promise<User> {
    return this.userService.getUserById(id);
  }

  @Post('/create')
  async createUser(@Body() user: CreateUserDto): Promise<Object> {
    try {
      const newUser = await this.userService.insertUser(user);
      return newUser;
    } catch (error) {
      return {
        message: 'create user fail...!',
      };
    }
  }

  @Post('/get-information')
  async getInformation(@Body() body: GetInformationDto): Promise<Object> {
    try {
      const contact = await this.userService.getUserByName(body.username);
      return contact.contactInfo;
    } catch (error) {
      return {
        message: 'get information fail...!',
      };
    }
  }

  // @Post('/contact')
  // async createContact(@Body() contact: CreateContactInfoDto): Promise<any> {
  //   this.contactService.createInfo(contact)
  // }

  @Put('/update-information')
  async updateInformation(
    @Body() request: UpdateInformationDto,
  ): Promise<Object> {
    try {
      await this.historyService.createHistory(
        CONSTANTS.HISTORY_TYPE.UPDATE_PROFILE,
        'Update Information',
        request.id,
      );
      const contact = await this.userService.updateUserInformation(request);
      return contact;
    } catch (error) {
      return {
        message: 'update fail...!',
      };
    }
  }

  @Put('/update-active')
  async updateActive(@Body() request: CreateUserDto): Promise<Object> {
    try {
      const user = await this.userService.updateUserActive(request);
      return user;
    } catch (error) {
      return {
        message: 'update fail...!',
      };
    }
  }

  @Put('/update-role')
  async updateRole(@Body() request: CreateUserDto): Promise<Object> {
    try {
      const user = await this.userService.updateUserRole(request);
      return user;
    } catch (error) {
      return {
        message: 'update fail...!',
      };
    }
  }

  // @Delete(':id')
  // async deletePost(@Param('id') id: string) {
  //   return this.userService.getUsers()
  // }

  @Put('change-password')
  async changePassword(@Body() data: ChangePasswordDto, @Res() res: Response) {
    try {
      await this.historyService.createHistory(
        CONSTANTS.HISTORY_TYPE.CHANGE_PASSWORD,
        'Change Password',
        data.userId,
      );
      const change = await this.userService.changePassword(data);
      res.send(change);
    } catch (error) {
      console.error(error)
      res.send(error);
    }
  }
}

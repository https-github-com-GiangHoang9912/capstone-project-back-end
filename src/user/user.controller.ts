import { Controller, Get, Post, Body, Put, UseGuards, Res, Param, HttpStatus } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { UserService } from '../services/user.service';
import { CreateUserDto } from '../dto/user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ContactInfo } from 'src/entities/contactInfo.entity';
import { GetInformationDto } from 'src/dto/get-info.dto';
import { Response } from 'express';
import { UpdateInformationDto } from 'src/dto/update-infomation.dto';
import * as moment from 'moment';
import { HistoryService } from 'src/services/history.service';
import { AuthService } from 'src/auth/auth.service';
import * as CONSTANTS from '../constant';

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
        CONSTANTS.HISTORY_TYPE.UPDATE_PROFILE, "Update Information" , request.id,
      );
      const contact = await this.userService.updateUserInformation(request);
      return contact;
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
}

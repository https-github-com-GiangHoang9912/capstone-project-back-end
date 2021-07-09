import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  UseGuards,
} from '@nestjs/common';
import { User } from '../entities/user.entity';
import { UserService } from '../services/user.service';
import { CreateUserDto } from '../dto/user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ContactInfo } from 'src/entities/contactInfo.entity';
import { GetInformationDto } from 'src/dto/get-info.dto';
import { UpdateInformationDto } from 'src/dto/update-infomation.dto';
import * as moment from 'moment';

@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getUsers(): Promise<User[]> {
    return this.userService.getUsers();
  }

  // @Get(':id')
  // getPostById(@Param('id') id: string) {
  //   return this.userService.getUserById(id);
  // }

  @Post('/create')
  async createUser(@Body() user: CreateUserDto): Promise<User> {
    const newUser = await this.userService.insertUser(user);

    return newUser;
  }

  @Post('/get-information')
  async updateProfile(@Body() body: GetInformationDto): Promise<ContactInfo> {
    const contact = await this.userService.getUserByName(body.username)
    return contact.contactInfo
  }

  // @Post('/contact')
  // async createContact(@Body() contact: CreateContactInfoDto): Promise<any> {
  //   this.contactService.createInfo(contact)
  // }

  @Put('/update-information')
  async updateInformation(@Body() request: UpdateInformationDto) {
    const contact = await this.userService.updateUserInformation(request)
    console.log(contact)
  }

  // @Delete(':id')
  // async deletePost(@Param('id') id: string) {
  //   return this.userService.getUsers()
  // }
}

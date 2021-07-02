import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
} from '@nestjs/common';
import { User } from '../entities/user.entity';
import { UserService } from '../services/user.service';
import { CreateUserDto } from '../dto/user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

// @UseGuards(JwtAuthGuard)
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

  // @Post('/profile')
  // async updateProfile(@Body() userId: ObjectID): Promise<ContactInfo> {
  //   const contact = this.contactService.createOrUpdateUserInfo()
  // }

  // @Post('/contact')
  // async createContact(@Body() contact: CreateContactInfoDto): Promise<any> {
  //   this.contactService.createInfo(contact)
  // }

  // @Put(':id')
  // async replacePost(@Param('id') id: string, @Body() post: string) {
  //   return this.userService.getUsers()
  // }

  // @Delete(':id')
  // async deletePost(@Param('id') id: string) {
  //   return this.userService.getUsers()
  // }
}

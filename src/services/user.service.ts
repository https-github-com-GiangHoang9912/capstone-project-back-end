import { ContactInfo } from './../entities/contactInfo.entity';
import { User } from '../entities/user.entity';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as CONSTANT from '../constant';
import * as bcrypt from 'bcrypt';

interface IUser {
  userName: string;
  password: string;
  role?: number;
  firstName?: string;
  lastName?: string;
  address?: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
}

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(ContactInfo)
    private readonly contactRepository: Repository<ContactInfo>,
  ) {}

  async getUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  async getUserByName(username: string): Promise<User> {
    const user = await this.userRepository.createQueryBuilder('users')
                .leftJoinAndSelect('users.contactInfo', 'contacts')
                .getOne()
    return user;
  }

  async insertUser(user: IUser): Promise<User> {
    try {
      if (await this.userRepository.findOne({ username: user.userName })) {
        throw new Error('username already exists...!');
      }

      const newUser = await this.userRepository
        .create({
          username: user.userName,
          password: await bcrypt.hash(
            user.password,
            CONSTANT.ROUND_HASH_PASSWORD.ROUND,
          ),
          role: CONSTANT.ROLE.USER,
        })
        .save();

      await this.contactRepository
        .create({
          firstName: user.firstName,
          lastName: user.lastName,
          address: user.address,
          dateOfBirth: user.dateOfBirth,
          email: user.email,
          phone: user.phone,
          user: newUser,
        })
        .save();

      return newUser;
    } catch (error) {
      Logger.error(error);
      return error;
    }
  }

  async updatePassword() {}
}

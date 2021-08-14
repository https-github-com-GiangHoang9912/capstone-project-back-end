import { request } from 'express';
import { ContactInfo } from '../entities/contactInfo.entity';
import { User } from '../entities/users.entity';
import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, MoreThanOrEqual, Repository } from 'typeorm';
import * as randomToken from 'rand-token';
import * as moment from 'moment';
import * as CONSTANTS from '../constant';
import * as bcrypt from 'bcrypt';

interface IUser {
  userName: string;
  password: string;
  role?: number;
  active?: boolean;
  firstName?: string;
  lastName?: string;
  address?: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
}

interface GoogleUser {
  email: string;
  familyName: string;
  givenName: string;
  googleId: string;
  imageUrl: string;
  name: string;
}

interface ChangePassword {
  userId: number;
  oldPassword: string;
  newPassword: string;
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
  async getAllUsers(): Promise<User[]> {
    return this.userRepository
      .createQueryBuilder('users')
      .where('role != 1')
      .leftJoinAndSelect('users.contactInfo', 'contacts')
      .getMany();
  }
  async getUserByName(username: string): Promise<User> {
    const user = await this.userRepository
      .createQueryBuilder('users')
      .where('username = :username', { username: username })
      .leftJoinAndSelect('users.contactInfo', 'contacts')
      .getOne();
    return user;
  }

  async searchUserByName(username: string): Promise<User[]> {
    return this.userRepository
      .createQueryBuilder('users')
      .where('username like :name', { name: `%${username}%` })
      .andWhere('role != 1')
      .leftJoinAndSelect('users.contactInfo', 'contacts')
      .getMany();
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
            CONSTANTS.ROUND_HASH_PASSWORD.ROUND,
          ),
          role: CONSTANTS.ROLE.USER,
          active: user.active,
          refreshToken: randomToken.generate(16),
          refreshTokenExp: moment()
            .utc()
            .add(30, 'minute')
            .format('YYYY/MM/DD HH:mm:ss'),
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

  async changePassword(data: ChangePassword): Promise<any> {
    const user = await this.getUserById(data.userId);
    const isVerifyPassword = user
      ? (await bcrypt.compare(data.oldPassword, user.password)) &&
        !(await bcrypt.compare(data.newPassword, user.password))
      : false;
    if (isVerifyPassword) {
      user.password = await bcrypt.hash(
        data.newPassword,
        CONSTANTS.ROUND_HASH_PASSWORD.ROUND,
      );
      await user.save();

      return {
        status: HttpStatus.OK,
        message: 'Change Password Successful',
      };
    }

    return {
      status: HttpStatus.UNPROCESSABLE_ENTITY,
      message: 'Password Was Duplicate Or Wrong',
    };
  }

  async insertUserByLoginGoogle(user: GoogleUser): Promise<any> {
    try {
      if (await this.contactRepository.findOne({ email: user.email })) {
        throw new Error('email already exists...!');
      }
      const randomPassword = Math.random().toString(36).slice(-8);
      const newUser = await this.userRepository
        .create({
          username: user.email,
          password: await bcrypt.hash(
            randomPassword,
            CONSTANTS.ROUND_HASH_PASSWORD.ROUND,
          ),
          role: CONSTANTS.ROLE.USER,
          refreshToken: randomToken.generate(16),
          refreshTokenExp: moment()
            .utc()
            .add(30, 'minute')
            .format('YYYY/MM/DD HH:mm:ss'),
        })
        .save();

      await this.contactRepository
        .create({
          firstName: user.givenName,
          lastName: user.familyName,
          email: user.email,
          avatar: user.imageUrl,
          user: newUser,
        })
        .save();

      return { newUser, randomPassword };
    } catch (error) {
      Logger.error(error);
      return error;
    }
  }

  async updateRefreshToken(userId: number): Promise<string> {
    const user = await this.userRepository.findOne(userId);
    user.refreshToken = randomToken.generate(16);
    user.refreshTokenExp = new Date(
      moment()
        .utc()
        .add(CONSTANTS.TOKEN_LIFE, 'minute')
        .format('YYYY/MM/DD HH:mm:ss'),
    );
    await user.save();
    return user.refreshToken;
  }

  async getUserWithRefreshToken(
    username: string,
    refreshToken: string,
    currentDate: Date,
  ): Promise<User> {
    const user = await this.userRepository.findOne({
      username: username,
      refreshToken: refreshToken,
      refreshTokenExp: MoreThanOrEqual(currentDate),
    });

    if (!user) {
      return null;
    }
    return user;
  }

  async getUserById(userId: number): Promise<User> {
    const user = this.userRepository.findOne(userId);
    return user;
  }

  async updateUserInformation(req: any): Promise<ContactInfo> {
    const contact = await this.contactRepository.findOne({ ownerId: req.id });
    contact.firstName = req.firstName;
    contact.lastName = req.lastName;
    contact.phone = req.phone;
    contact.dateOfBirth = new Date(moment(req.dob, ['DD/MM/YYYY']).format());
    contact.address = req.address;
    if (req.avatar) {
      contact.avatar = req.avatar;
    }
    contact.save();
    return contact;
  }
  async updateUserActive(req: any): Promise<User> {
    const user = await this.userRepository.findOne({ id: req.id });
    user.active = req.active;
    user.save();
    return user;
  }
  async updateUserRole(req: any): Promise<User> {
    const user = await this.userRepository.findOne({ id: req.roleId });
    user.role = req.roleValue;
    user.save();
    return user;
  }

  async getUserByEmail(email: string) {
    const user = await this.userRepository
      .createQueryBuilder('users')
      .leftJoinAndSelect('users.contactInfo', 'contacts')
      .where('contacts.email = :email', { email: email })
      .getOne();

    return user;
  }

  async forgotPassword(email: string): Promise<any> {
    const user = await this.getUserByEmail(email);
    const randomPassword = Math.random().toString(36).slice(-8);
    if (user) {
      user.password = await bcrypt.hash(
        randomPassword,
        CONSTANTS.ROUND_HASH_PASSWORD.ROUND,
      );
      await user.save();

      return {
        password: randomPassword,
        user: user,
      };
    }
  }
}

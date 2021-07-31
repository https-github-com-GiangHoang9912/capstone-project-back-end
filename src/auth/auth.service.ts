import { MailService } from './../services/mail.service';
import { Injectable } from '@nestjs/common';
import { UserService } from '../services/users.service';
import * as bcrypt from 'bcrypt';
import * as randomToken from 'rand-token';
import * as moment from 'moment';
import { JwtService } from '@nestjs/jwt';
import { config } from 'dotenv';
import { Request } from 'express';

config();
@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
    private mailService: MailService
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.getUserByName(username);
    const isLogin = user ? await bcrypt.compare(pass, user.password) : false;
    if (user && isLogin) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(request: Request) {
    const user = await this.usersService.getUserByName(request.body.username);
    // update refresh token
    const refreshJwtToken = await this.usersService.updateRefreshToken(user.id);

    return {
      access_token: this.jwtService.sign({
        name: user.username,
        role: user.role,
        sub: user.id,
      }),
      refresh_token: refreshJwtToken,
      account: {
        id: user.id,
        role: user.role,
        username: user.username,
        profile: user.contactInfo,
      },
    };
  }

  async loginGoogle(request: Request) {
    // get user if exist
    let user = await this.usersService.getUserByName(request.body.email);
    if (!user) {
      // if not exist create new user with info of google account
      const data = await this.usersService.insertUserByLoginGoogle(request.body);
      user = await this.usersService.getUserByName(data.newUser.username)
      const res_email = await this.mailService.sendGoogleEmail(user, data.randomPassword);
      console.log("loginGoogle-email", res_email)
    }
    // update refresh token
    const refreshJwtToken = await this.usersService.updateRefreshToken(user.id);
    return {
      access_token: this.jwtService.sign({
        name: user.username,
        role: user.role,
        sub: user.id,
      }),
      refresh_token: refreshJwtToken,
      account: {
        id: user.id,
        role: user.role,
        username: user.username,
        profile: user.contactInfo,
      },
    };
  }

  async validateRefreshJwtToken(username: string, refreshToken: string) {
    const currentDate = new Date(moment().utc().format('YYYY/MM/DD HH:mm:ss'));
    const user = await this.usersService.getUserWithRefreshToken(
      username,
      refreshToken,
      currentDate,
    );
    return user;
  }

  async getRefreshToken(userId: number): Promise<string> {
    const refreshToken = await this.usersService.updateRefreshToken(userId)
    return refreshToken
  }

  async getJwtToken(userId: number): Promise<string> {
    const user = await this.usersService.getUserById(userId)
    const jwtToken = this.jwtService.signAsync({
      name: user.username,
      role: user.role,
      sub: user.id,
    })
    return jwtToken
  }

  verifyToken(token: string) {
    return this.jwtService.verify(token)
  }

}

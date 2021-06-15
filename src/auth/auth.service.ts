import { Injectable } from '@nestjs/common';
import { UserService } from '../services/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { config } from 'dotenv';

config();
@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
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

  async login(payload: any) {
    const user = await this.usersService.getUserByName(payload.username);
    return {
      access_token: this.jwtService.sign({
        name: user.username,
        sub: user.id,
      }),
      account: {
        role: user.role,
        username: user.username,
        profile: user.contactInfo,
      },
    };
  }
}

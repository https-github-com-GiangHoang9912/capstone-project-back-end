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

    const isLogin = await bcrypt.compare(pass, user.passwordEncryption);

    if (user && isLogin) {
      const { passwordEncryption, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { name: user.username, sub: user._id };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}

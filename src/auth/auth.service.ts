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

  async validateUser(payload: any): Promise<any> {
    const user = await this.usersService.getUserByName(payload.username);

    const isLogin = await bcrypt.compare(payload.password, user.passwordEncryption);

    if (user && isLogin) {
      const { passwordEncryption, ...result } = user;
      return result;
    }
    return null;
  }

  async login(request: any) {
    const user = await this.validateUser(request)
    const payload = { name: user.username, sub: user._id, role: user.role};

    return {
      access_token: this.jwtService.sign(payload),
      role: payload.role
    };
  }
}

import { Injectable } from '@nestjs/common';
import { UserService } from '../services/user.service';
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
  constructor(private usersService: UserService) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.getUserByName(username);

    const isLogin = await bcrypt.compare(pass, user.passwordEncryption)

    if (user && isLogin) {
      const { passwordEncryption, ...result } = user;
      return result;
    }
    return null;
  }
}
import { UserService } from 'src/services/users.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { AuthService } from './auth/auth.service';
import {
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  Body,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { AppService } from './app.service';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { Response, Request, request } from 'express';
import { RefreshTokenGuard } from './auth/refresh-token.guard';
import * as CONSTANT from './constant'

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService,
  ) {}

  // @UseGuards(JwtAuthGuard)
  @Get()
  async createAdmin(@Req() req: Request) {
    await this.appService.seed();
  }

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Req() req: Request, @Res() res: Response) {
    try {
      const info = await this.authService.login(req);
      const secretData = {
        jwt_token: info.access_token,
        refresh_token: info.refresh_token,
      };
      res
        .status(HttpStatus.ACCEPTED)
        .cookie('token', secretData, {
          sameSite: 'strict',
          path: '/',
          expires: new Date(new Date().getTime() + CONSTANT.TOKEN_LIFE * 60000),
          secure: true,
          httpOnly: true,
        })
        .send(info.account);
    } catch (error) {
      console.log('login:\n', error);
    }
  }

  @Post('google-auth/login')
  async loginByGoogle(@Req() req: Request, @Res() res: Response) {
    try {
      const info = await this.authService.loginGoogle(req);
      const secretData = {
        jwt_token: info.access_token,
        refresh_token: info.refresh_token,
      };
      res
        .status(HttpStatus.ACCEPTED)
        .cookie('token', secretData, {
          sameSite: 'strict',
          path: '/',
          expires: new Date(new Date().getTime() + CONSTANT.TOKEN_LIFE * 60000),
          secure: true,
          httpOnly: true,
        })
        .send(info.account);
    } catch (error) {
      console.log('loginByGoogle\n', error);
    }
  }

  @UseGuards(RefreshTokenGuard)
  @Post('/refresh-token')
  async refreshJwtToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const token = await this.authService.getJwtToken(req.body.id);
      const refreshToken = await this.authService.getRefreshToken(req.body.id);
      const secretData = {
        jwt_token: token,
        refresh_token: refreshToken,
      };
      res
        .status(HttpStatus.ACCEPTED)
        .cookie('token', secretData, {
          sameSite: 'strict',
          path: '/',
          expires: new Date(new Date().getTime() + CONSTANT.TOKEN_LIFE * 60000),
          secure: true,
          httpOnly: true,
        })
        .send('refresh token successful');
    } catch (error) {
      console.log('refreshJwtToken:\n', error);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('/logout')
  async logout(@Res() res: Response) {
    try {
      res
        .status(HttpStatus.ACCEPTED)
        .cookie('token', "", {
          sameSite: 'strict',
          path: '/',
          secure: true,
          httpOnly: true,
        })
        .send("logout");
    } catch (error) {
      console.log('logout\n', error);
    }
  }
}

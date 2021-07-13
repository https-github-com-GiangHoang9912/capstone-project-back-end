import { UserService } from 'src/services/user.service';
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
          expires: new Date(new Date().getTime() + 1800 * 1000),
          secure: true,
          httpOnly: true,
        })
        .send(info.account);
    } catch (error) {}
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
          expires: new Date(new Date().getTime() + 1800 * 1000),
          secure: true,
          httpOnly: true,
        })
        .send(info.account);
    } catch (error) {}
  }

  @UseGuards(RefreshTokenGuard)
  @Post('/refresh-token')
  async refreshJwtToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const token = await this.authService.getJwtToken(req.body.id);
      const refreshToken = await this.authService.getRefreshToken(
        req.body.id,
      );
      const secretData = {
        jwt_token: token,
        refresh_token: refreshToken,
      };
      res
        .status(HttpStatus.ACCEPTED)
        .cookie('token', secretData, {
          sameSite: 'strict',
          path: '/',
          expires: new Date(new Date().getTime() + 1800 * 1000),
          secure: true,
          httpOnly: true,
        })
        .send('refresh token successful');
    } catch (error) {}
  }
}

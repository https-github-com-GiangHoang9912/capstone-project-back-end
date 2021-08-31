import { UserService } from './services/users.service';
import { MailService } from './services/mail.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { AuthService } from './auth/auth.service';
import {
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  Res,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { Response, Request } from 'express';
import { RefreshTokenGuard } from './auth/refresh-token.guard';
import * as CONSTANT from './constant';
import * as bcrypt from 'bcrypt';
import { HistoryService } from './services/histories.service';

interface IEmail {
  email: string;
}
@Controller()
export class AppController {
  constructor(
    private readonly authService: AuthService,
    private readonly mailService: MailService,
    private readonly userService: UserService,
  ) {}

  @Get('/forgot-password')
  async forgotPassword(@Res() res: Response, @Query() query: IEmail) {
    try {
      const dataResponse = await this.userService.forgotPassword(query.email);
      await this.mailService.sendGoogleEmail(
        dataResponse.user,
        dataResponse.password,
      );
      return res.redirect('https://ddsgq.xyz/login');
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).send(error);
    }
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
      return res
        .status(HttpStatus.ACCEPTED)
        .cookie('token', secretData, {
          sameSite: 'strict',
          path: '/',
          maxAge: 1.5 * 60 * 60 * 1000,
          expires: new Date(new Date().getTime() + CONSTANT.TOKEN_LIFE * 60000),
          secure: true,
          httpOnly: true,
        })
        .send(info.account);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).send(error.response);
    }
  }

  @Post('google-auth/login')
  async loginByGoogle(@Req() req: Request, @Res() res: Response) {
    try {
      const patten = new RegExp('(@fpt.edu.vn)|(@fe.edu.vn)');
      const isFPTEmail = patten.test(req.body.email);

      if (!isFPTEmail)
        return res.status(HttpStatus.FORBIDDEN).send({ isFPTEmail });

      const info = await this.authService.loginGoogle(req);
      const secretData = {
        jwt_token: info.access_token,
        refresh_token: info.refresh_token,
      };
      return res
        .status(HttpStatus.ACCEPTED)
        .cookie('token', secretData, {
          sameSite: 'strict',
          path: '/',
          maxAge: 1.5 * 60 * 60 * 1000,
          expires: new Date(new Date().getTime() + CONSTANT.TOKEN_LIFE * 60000),
          secure: true,
          httpOnly: true,
        })
        .send(info.account);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).send(error.response);
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
          maxAge: 1.5 * 60 * 60 * 1000,
          expires: new Date(new Date().getTime() + CONSTANT.TOKEN_LIFE * 60000),
          secure: true,
          httpOnly: true,
        })
        .send('refresh token successful');
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).send(error.response);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('/logout')
  async logout(@Res() res: Response) {
    try {
      return res
        .status(HttpStatus.ACCEPTED)
        .cookie('token', '', {
          sameSite: 'strict',
          path: '/',
          httpOnly: true,
        })
        .send('logout');
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).send(error.response);
    }
  }

  @Post('/verify-user')
  async verifyUser(@Req() req: Request, @Res() res: Response) {
    try {
      const dataResponse = await this.userService.getUserByEmail(
        req.body.email,
      );
      if (!dataResponse) {
        return res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .send('email is not correct');
      }
      await this.mailService.sendGoogleEmailForgot(dataResponse);
      return res.status(HttpStatus.OK).send('send verify to ' + req.body.email);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).send(error.response);
    }
  }
}

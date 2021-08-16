import { AuthService } from './auth.service';
import { Request } from 'express';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { BadRequestException, Injectable, Req } from '@nestjs/common';
import { config } from 'dotenv';

config();

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          const secretData = request?.cookies['token'];
          return secretData?.jwt_token;
        },
      ]),
      ignoreExpiration: false,
      passReqToCallback: true,
      secretOrKey: process.env.JWT_SIGN_SECRET,
    });
  }

  async validate(@Req() req: Request, payload: any) {
    const secretData = req?.cookies['token'];
    if (!secretData || !secretData?.refresh_token) {
      throw new BadRequestException();
    }
    const user = await this.authService.validateRefreshJwtToken(
      payload.name,
      secretData.refresh_token,
    );
    if (!user) {
      throw new BadRequestException();
    }
    return {
      username: user.username,
      sub: user.id,
    };
  }
}

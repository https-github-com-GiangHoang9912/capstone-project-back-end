import { Request } from 'express';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { config } from 'dotenv';

config();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          const secretData = request?.cookies['token'];
          return secretData?.jwt_token;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SIGN_SECRET,
    });
  }

  async validate(payload: any) {
    return {
      username: payload.username,
      sub: payload.id,
    };
  }
}

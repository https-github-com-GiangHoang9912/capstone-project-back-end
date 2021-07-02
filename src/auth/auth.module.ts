import { JwtStrategy } from './jwt.strategy';
import { SessionSerializer } from './session.serializer';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { config } from 'dotenv';
import { RefreshStrategy } from './refresh.strategy';

config();
@Module({
  //.register({ session: true })
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SIGN_SECRET,
      signOptions: { expiresIn: '30s' },
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, RefreshStrategy],
  exports: [AuthService],
})
export class AuthModule {}

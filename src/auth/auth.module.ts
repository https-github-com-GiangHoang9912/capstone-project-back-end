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
import { MailModule } from 'src/mail/mail.module';

config();
@Module({
  //.register({ session: true })
  imports: [
    UserModule,
    PassportModule,
    MailModule,
    JwtModule.register({
      secret: process.env.JWT_SIGN_SECRET,
      signOptions: { expiresIn: '1800s' },
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, RefreshStrategy],
  exports: [AuthService],
})
export class AuthModule {}

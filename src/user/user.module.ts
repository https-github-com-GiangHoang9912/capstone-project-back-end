import { AuthModule } from './../auth/auth.module';
import { HistoryModule } from './../history/history.module';
import { ContactInfo } from './../entities/contactInfo.entity';
import { Module, MiddlewareConsumer } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from '../services/user.service';
import { LoggerMiddleware } from '../common/middleware/logger.middleware';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, ContactInfo]), HistoryModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes(UserController);
  }
}

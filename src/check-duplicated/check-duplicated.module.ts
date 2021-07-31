import { AuthModule } from './../auth/auth.module';
import { HistoryModule } from '../histories/histories.module';
import { CheckDuplicatedService } from 'src/services/check-duplicated.service';
import { CheckDuplicatedController } from './check-duplicated.controller';
import { Module, MiddlewareConsumer } from '@nestjs/common';
import { LoggerMiddleware } from 'src/common/middleware/logger.middleware';

@Module({
  imports: [HistoryModule, AuthModule],
  controllers: [CheckDuplicatedController],
  providers: [CheckDuplicatedService],
  exports: [CheckDuplicatedService],
})
export class CheckDuplicatedModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes(CheckDuplicatedController);
  }
}

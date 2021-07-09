import { HistoryModule } from './../history/history.module';
import { AuthModule } from './../auth/auth.module';
import { SelfGenerateController } from './self-generate.controller';
import { Module, MiddlewareConsumer } from '@nestjs/common';
import { SelfGenerateService } from '../services/self-generate.service';
import { LoggerMiddleware } from 'src/common/middleware/logger.middleware';

@Module({
  imports: [AuthModule, HistoryModule],
  controllers: [SelfGenerateController],
  providers: [SelfGenerateService],
  exports: [SelfGenerateService],
})
export class SelfGenerateModule {
  configure(consumer: MiddlewareConsumer) {
      consumer.apply(LoggerMiddleware).forRoutes(SelfGenerateController);
    }
}

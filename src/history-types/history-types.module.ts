import { HistoryType } from '../entities/history-types.entity';
import { History } from '../entities/histories.entity';
import { HistoryTypeService } from '../services/history-types.service';
import { HistoryTypeController } from './history-types.controller';
import { Module, MiddlewareConsumer } from '@nestjs/common';
import { LoggerMiddleware } from '../common/middleware/logger.middleware';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([History, HistoryType])],
  controllers: [HistoryTypeController],
  providers: [HistoryTypeService],
  exports: [HistoryTypeService],
})
export class HistoryTypeModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes(HistoryTypeController);
  }
}

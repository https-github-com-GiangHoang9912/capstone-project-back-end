import { HistoryType } from './../entities/history-type.entity';
import { History } from './../entities/history.entity';
import { HistoryTypeService } from './../services/history-type.service';
import { HistoryTypeController } from './history-type.controller';
import { Module, MiddlewareConsumer } from '@nestjs/common';
import { LoggerMiddleware } from 'src/common/middleware/logger.middleware';
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

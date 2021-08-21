import { QuestionModule } from './../questions/questions.module';
import { Answer } from '../entities/answers.entity';
import { AnswerGroup } from '../entities/answer-groups.entity';
import { AnswerGroupService } from '../services/answers-groups.service';
import { AnswerGroupController } from './answers-groups.controller';
import { Module, MiddlewareConsumer } from '@nestjs/common';
import { LoggerMiddleware } from '../common/middleware/logger.middleware';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([AnswerGroup, Answer]), QuestionModule],
  controllers: [AnswerGroupController],
  providers: [AnswerGroupService],
  exports: [AnswerGroupService],
})
export class AnswersGroupsModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes(AnswerGroupController);
  }
}

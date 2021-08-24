import { Exam } from '../entities/exams.entity';
import { AnswerGroup } from '../entities/answer-groups.entity';
import { Question } from '../entities/questions.entity';
import { QuestionService } from '../services/questions.service';
import { QuestionController } from './questions.controller';
import { Module, MiddlewareConsumer } from '@nestjs/common';
import { LoggerMiddleware } from '../common/middleware/logger.middleware';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistoryModule } from 'src/histories/histories.module';

@Module({
  imports: [TypeOrmModule.forFeature([Exam, Question, AnswerGroup]),
    HistoryModule
  ],
  controllers: [QuestionController],
  providers: [QuestionService],
  exports: [QuestionService],
})
export class QuestionModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes(QuestionController);
  }
}

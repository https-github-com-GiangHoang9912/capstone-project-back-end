import { Question } from '../entities/questions.entity';
import { QuestionBankService } from './../services/question-bank.service';
import { Module, MiddlewareConsumer } from '@nestjs/common';
import { LoggerMiddleware } from '../common/middleware/logger.middleware';
import { QuestionBankController } from './question-bank.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subject } from '../entities/subjects.entity';
import { QuestionBank } from '../entities/question-bank.entity';

@Module({
  imports: [TypeOrmModule.forFeature([QuestionBank, Question, Subject])],
  controllers: [QuestionBankController],
  providers: [QuestionBankService],
  exports: [QuestionBankService],
})
export class QuestionBankModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes(QuestionBankController);
  }
}

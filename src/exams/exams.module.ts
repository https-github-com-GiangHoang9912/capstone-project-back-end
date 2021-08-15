import { QuestionModule } from './../questions/questions.module';
import { QuestionBankModule } from './../question-bank/question-bank.module';
import { Subject } from '../entities/subjects.entity';
import { Exam } from '../entities/exams.entity';
import { ExamService } from '../services/exams.service';
import { ExamController } from './exams.controller';
import { Module, MiddlewareConsumer } from '@nestjs/common';
import { LoggerMiddleware } from '../common/middleware/logger.middleware';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Exam, Subject]),
    QuestionBankModule,
    QuestionModule,
  ],
  controllers: [ExamController],
  providers: [ExamService],
  exports: [ExamService],
})
export class ExamModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes(ExamController);
  }
}

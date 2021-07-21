import { Subject } from './../entities/subject.entity';
import {Exam} from './../entities/exam.entity';
import {Question} from './../entities/question.entity';
import { QuestionService } from './../services/question.service';
import { QuestionController } from './question.controller';
import { Module, MiddlewareConsumer } from '@nestjs/common';
import { LoggerMiddleware } from 'src/common/middleware/logger.middleware';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Exam, Question])],
  controllers: [QuestionController],
  providers: [QuestionService],
  exports: [QuestionService],
})
export class QuestionModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes(QuestionController);
  }
}

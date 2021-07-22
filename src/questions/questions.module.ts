import { Subject } from '../entities/subjects.entity';
import {Exam} from '../entities/exams.entity';
import {Question} from '../entities/questions.entity';
import { QuestionService } from '../services/questions.service';
import { QuestionController } from './questions.controller';
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

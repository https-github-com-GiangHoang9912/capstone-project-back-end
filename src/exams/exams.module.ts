import { Subject } from '../entities/subjects.entity';
import { Exam } from '../entities/exams.entity';
import { ExamService } from '../services/exams.service';
import { ExamController } from './exams.controller';
import { Module, MiddlewareConsumer } from '@nestjs/common';
import { LoggerMiddleware } from 'src/common/middleware/logger.middleware';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Exam, Subject])],
  
controllers: [ExamController],
  providers: [ExamService],
  exports: [ExamService],
})
export class ExamModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes(ExamController);
  }
}

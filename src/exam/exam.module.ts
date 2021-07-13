import { Subject } from './../entities/subject.entity';
import { Exam } from './../entities/exam.entity';
import { ExamService } from './../services/exam.service';
import { ExamController } from './exam.controller';
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

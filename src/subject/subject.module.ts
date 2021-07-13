import { Subject } from './../entities/subject.entity';
import {Exam} from './../entities/exam.entity';
import { SubjectService } from './../services/subject.service';
import { SubjectController } from './subject.controller';
import { Module, MiddlewareConsumer } from '@nestjs/common';
import { LoggerMiddleware } from 'src/common/middleware/logger.middleware';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Exam, Subject])],
  controllers: [SubjectController],
  providers: [SubjectService],
  exports: [SubjectService],
})
export class SubjectModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes(SubjectController);
  }
}

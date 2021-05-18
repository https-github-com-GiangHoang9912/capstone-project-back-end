import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { StudentController } from './student.controller';
import { StudentService } from './student.service';
import { LoggerMiddleware } from '../common/middleware/logger.middleware';

@Module({
  controllers: [StudentController],
  providers: [StudentService],
})
export class StudentModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes(StudentController);
  }
}

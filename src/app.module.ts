import { ContactInfo } from './entities/contactInfo.entity';
import { UserModule } from './users/users.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { User } from './entities/users.entity';
import { AuthModule } from './auth/auth.module';
import { config } from 'dotenv';
import { CheckDuplicatedModule } from './check-duplicated/check-duplicated.module';
import { SelfGenerateModule } from './self-generate/self-generate.module';
import { MailModule } from './mail/mail.module';
import { HistoryTypeModule } from './history-types/history-types.module';
import { HistoryModule } from './histories/histories.module';
import {ExamModule} from './exams/exams.module';
import {SubjectModule} from './subjects/subjects.module';
import { QuestionModule } from './questions/questions.module';
config();

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      database: process.env.DATABASE_NAME,
      synchronize: false,
      username: "root",
      password: process.env.PASSWORD,
      logging: false,
      autoLoadEntities: true,
      entities: [join(__dirname, '**/**.entity{.ts,.js}')],
      cli: {
        entitiesDir: 'src/entities',
      },
    }),
    TypeOrmModule.forFeature([User, ContactInfo]),
    AuthModule,
    CheckDuplicatedModule,
    SelfGenerateModule,
    MailModule,
    HistoryTypeModule,
    HistoryModule,
    ExamModule,
    SubjectModule,
    QuestionModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

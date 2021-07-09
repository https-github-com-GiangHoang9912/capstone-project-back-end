import { CheckDuplicatedService } from 'src/services/check-duplicated.service';
import { CheckDuplicatedController } from './check-duplicated/check-duplicated.controller';
import { ContactInfo } from './entities/contactInfo.entity';
import { UserModule } from './user/user.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { User } from './entities/user.entity';
import { AuthModule } from './auth/auth.module';
import { config } from 'dotenv';
import { CheckDuplicatedModule } from './check-duplicated/check-duplicated.module';
import { SelfGenerateController } from './self-generate/self-generate.controller';
import { SelfGenerateModule } from './self-generate/self-generate.module';
import { MailModule } from './mail/mail.module';

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
      username: process.env.USERNAME,
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
  ],
  controllers: [AppController, SelfGenerateController],
  providers: [AppService],
})
export class AppModule {}

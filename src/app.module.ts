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

config();

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forRoot({
      name: 'default',
      type: 'mongodb',
      username: process.env.USERNAME,
      password: process.env.PASSWORD,
      host: process.env.HOST,
      logging: false,
      port: Number(process.env.DB_PORT),
      database: process.env.DATABASE_NAME,
      useNewUrlParser: true,
      autoLoadEntities: true,
      useUnifiedTopology: true,
      entities: [join(__dirname, '**/**.entity{.ts,.js}')],
      cli: {
        entitiesDir: 'src/entities',
      },
    }),
    TypeOrmModule.forFeature([User, ContactInfo]),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

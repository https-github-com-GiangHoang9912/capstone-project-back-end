import { ContactInfo } from './entities/contactInfo.entity';
import { UserModule } from './user/user.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { User } from './entities/user.entity';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forRoot({
      name: 'default',
      type: 'mongodb',
      host: 'localhost',
      logging: false,
      port: 27017,
      database: 'DDSGQ',
      useNewUrlParser: true,
      autoLoadEntities: true,
      useUnifiedTopology: true,
      entities: [join(__dirname, '**/**.entity{.ts,.js}')],
      cli: {
        entitiesDir: 'src/entities',
      },
    }),
    TypeOrmModule.forFeature([User, ContactInfo])
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

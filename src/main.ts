import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as passport from 'passport';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  // app.use(
  //   session({
  //     secret: 'keyboard cat',
  //     resave: false,
  //     saveUninitialzed: false,
  //     cookie: { maxAge: 3600000 },
  //   }),
  // );

  // app.use(passport.initialize());
  // app.use(passport.session());

  app.enableCors();
  await app.listen(3001);
}
bootstrap();

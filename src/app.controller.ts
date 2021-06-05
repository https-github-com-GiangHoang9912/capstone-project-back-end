import { AuthenticatedGuard } from './auth/authenticated.guard';
import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { LocalAuthGuard } from './auth/local-auth.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Req() req) {
    return req.user;
  }

  @UseGuards(AuthenticatedGuard)
  @Get()
  async createAdmin() {
    await this.appService.seed()
  }
  
}

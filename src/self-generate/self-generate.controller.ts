import { SelfGenerateService } from './../services/self-generate.service';
import {
  Post,
  Body,
  Res,
  Controller,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { SelfGenerationDto } from 'src/dto/self-generation.dto';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('self-generate')
export class SelfGenerateController {
  constructor(private readonly generateService: SelfGenerateService) {}

  @Post('/')
  async createUser(
    @Body() body: SelfGenerationDto[],
    @Res() res: Response,
  ): Promise<any> {
    const data = await this.generateService.generationQuestions(body);
    return res.status(HttpStatus.OK).send(data);
  }
}

import { SelfGenerateService } from './../services/self-generate.service';
import {
  Post,
  Body,
  Res,
  Controller,
  HttpStatus,
  UseGuards,
  Req,
} from '@nestjs/common';
import { SelfGenerationDto } from 'src/dto/self-generation.dto';
import { Response, Request } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import * as CONSTANTS from '../constant';
import { HistoryService } from 'src/services/history.service';
import { AuthService } from 'src/auth/auth.service';

@UseGuards(JwtAuthGuard)
@Controller('self-generate')
export class SelfGenerateController {
  constructor(
    private readonly generateService: SelfGenerateService,
    private readonly historyService: HistoryService,
    private readonly authService: AuthService,
  ) {}

  @Post('/')
  async createUser(
    @Req() req: Request,
    @Body() body: SelfGenerationDto[],
    @Res() res: Response,
  ): Promise<any> {
    try {
      const user = this.authService.verifyToken(req.cookies.token.jwt_token);
      body.forEach(async (item) => {
        await this.historyService.createHistory(
          CONSTANTS.HISTORY_TYPE.GENERATE,
          `${item.answer}`,
          user.sub,
        );
      });
      const data = await this.generateService.generationQuestions(body);
      return res.status(HttpStatus.OK).send(data);
    } catch (error) {}
  }
}

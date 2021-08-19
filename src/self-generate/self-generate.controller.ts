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
import { SelfGenerationDto } from '../dto/self-generation.dto';
import { Response, Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import * as CONSTANTS from '../constant';
import { HistoryService } from '../services/histories.service';
import { AuthService } from '../auth/auth.service';

@UseGuards(JwtAuthGuard)
@Controller('self-generate')
export class SelfGenerateController {
  constructor(
    private readonly generateService: SelfGenerateService,
    private readonly historyService: HistoryService,
    private readonly authService: AuthService,
  ) {}

  @Post('/')
  async selfGenerate(
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
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error);
    }
  }
}

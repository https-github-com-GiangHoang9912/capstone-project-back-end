import { AuthService } from './../auth/auth.service';
import { HistoryService } from './../services/history.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';
import {
  Body,
  Post,
  Controller,
  Res,
  HttpStatus,
  Req,
  UseGuards,
} from '@nestjs/common';
import { QuestionCheckDuplicatedDto } from 'src/dto/check-duplicated.dto';
import { CheckDuplicatedService } from 'src/services/check-duplicated.service';
import { Response, Request } from 'express';
import * as CONSTANTS from '../constant';

@UseGuards(JwtAuthGuard)
@Controller('check-duplicated')
export class CheckDuplicatedController {
  constructor(
    private readonly checkDuplicatedService: CheckDuplicatedService,
    private readonly historyService: HistoryService,
    private readonly authService: AuthService
  ) {}

  @Post('/')
  async createUser(
    @Req() req: Request,
    @Body() questions: QuestionCheckDuplicatedDto,
    @Res() res: Response,
  ): Promise<any> {
    try {
      const user = this.authService.verifyToken(req.cookies.token.jwt_token)
      await this.historyService.createHistory(CONSTANTS.HISTORY_TYPE.DUPLICATE, questions.question, user.sub)
      const data = await this.checkDuplicatedService.checkDuplicated(
        questions.question,
      );
      return res.status(HttpStatus.OK).send(data.data);
    } catch (error) {
      console.log(error)
    }
  }
}

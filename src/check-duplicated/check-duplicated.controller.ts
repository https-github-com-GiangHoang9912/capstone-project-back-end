import { QuestionBankService } from './../services/question-bank.service';
import { AuthService } from './../auth/auth.service';
import { HistoryService } from '../services/histories.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  Body,
  Post,
  Controller,
  Res,
  HttpStatus,
  Req,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { QuestionCheckDuplicatedDto } from '../dto/check-duplicated.dto';
import { CheckDuplicatedService } from '../services/check-duplicated.service';
import { Response, Request } from 'express';
import * as CONSTANTS from '../constant';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import * as fs from 'fs';
import * as readline from 'readline';

@UseGuards(JwtAuthGuard)
@Controller('check-duplicated')
export class CheckDuplicatedController {
  constructor(
    private readonly checkDuplicatedService: CheckDuplicatedService,
    private readonly historyService: HistoryService,
    private readonly authService: AuthService,
    private readonly questionBankService: QuestionBankService,
  ) {}

  @Post('/')
  async checkDuplicated(
    @Req() req: Request,
    @Body() questions: QuestionCheckDuplicatedDto,
    @Res() res: Response,
  ): Promise<any> {
    try {
      const user = this.authService.verifyToken(req.cookies.token.jwt_token);
      await this.historyService.createHistory(
        CONSTANTS.HISTORY_TYPE.DUPLICATE,
        questions.question,
        user.sub,
      );
      const data = await this.checkDuplicatedService.checkDuplicated(
        questions.question,
      );
      return res.status(HttpStatus.OK).send(data.data);
    } catch (error) {}
  }

  @Post('/train-sentences')
  async checkDuplicatedWithSentence(
    @Req() req: Request,
    @Body() sentences: QuestionCheckDuplicatedDto,
    @Res() res: Response,
  ): Promise<any> {
    try {
      const user = this.authService.verifyToken(req.cookies.token.jwt_token);
      await this.historyService.createHistory(
        CONSTANTS.HISTORY_TYPE.DUPLICATE,
        'Training data for duplicate model',
        user.sub,
      );

      const data = await this.checkDuplicatedService.trainingDataWithSentence(
        sentences,
      );

      return res.status(HttpStatus.OK).send(data.data);
    } catch (error) {}
  }

  @UseGuards(JwtAuthGuard)
  @Post('/upload-dataset')
  @UseInterceptors(
    FileInterceptor('train', {
      storage: diskStorage({
        destination: './uploads/datasets',
        filename: (req, file, cb) => {
          const filename: string = path
            .parse(file.fieldname)
            .name.replace(/\s/g, '');
          const extension: string = path.parse(file.originalname).ext;

          cb(null, `${filename}${extension}`);
        },
      }),
    }),
  )
  async uploadDataset(
    @Req() req: Request,
    @UploadedFile() file,
    @Res() res: Response,
  ): Promise<any> {
    try {
      const user = this.authService.verifyToken(req.cookies.token.jwt_token);
      if (user.role !== 2) return;

      const fileStream = fs.createReadStream(file.path);
      const lines = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity,
      });
      let indexLine = 0;
      for await (const line of lines) {
        if (indexLine != 0) {
          const dataLine = line.split(',');
          const data = await this.checkDuplicatedService.checkDuplicated(
            dataLine[0],
          );
          if (data.data[0].point >= 0.6) continue;

          await this.questionBankService.addQuestionNoDuplicateToBank(
            1,
            dataLine[0],
          );
        }
        indexLine++;
      }

      await this.checkDuplicatedService.trainingData();
      return res.status(HttpStatus.OK).send('success');
    } catch (error) {
      console.log(error);
      return res.status(HttpStatus.OK).send('success');
    }
  }
}

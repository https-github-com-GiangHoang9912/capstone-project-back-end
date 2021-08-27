import { SubjectService } from './../services/subjects.service';
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
import * as fastCsv from 'fast-csv';

interface DataTrain {
  sentence: string;
  tag: number;
}

@UseGuards(JwtAuthGuard)
@Controller('check-duplicated')
export class CheckDuplicatedController {
  constructor(
    private readonly checkDuplicatedService: CheckDuplicatedService,
    private readonly historyService: HistoryService,
    private readonly authService: AuthService,
    private readonly questionBankService: QuestionBankService,
    private readonly subjectService: SubjectService,
  ) {}

  @Post('/')
  async checkDuplicated(
    @Req() req: Request,
    @Body() questions: QuestionCheckDuplicatedDto,
    @Res() res: Response,
  ): Promise<any> {
    try {
      const user = this.authService.verifyToken(req.cookies.token.jwt_token);
      const listQuestionBank = await this.subjectService.getQuestionBankBySubjectId(questions.subjectId)
      await this.historyService.createHistory(
        CONSTANTS.HISTORY_TYPE.DUPLICATE,
        questions.question,
        user.sub,
      );

      await this.checkDuplicatedService.trainBankWithSubject(listQuestionBank)

      const data = await this.checkDuplicatedService.checkDuplicated(
        questions.question,
        listQuestionBank[0].subjectName
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
    @UploadedFile() file: any,
    @Res() res: Response,
  ): Promise<any> {
    try {
      const user = this.authService.verifyToken(req.cookies.token.jwt_token);
      if (user.role === 3) return;

      const subject = await this.subjectService.getSubjectById(req.body.subject)

      console.log(subject)

      fs.createReadStream(file.path)
        .pipe(fastCsv.parse({ headers: true }))
        .on('error', (error) => console.error(error))
        .on('data', async (row: DataTrain) => {
          const data = await this.checkDuplicatedService.checkDuplicated(
            row.sentence,
            subject.subjectName
          );

          if (data && data.data[0].point < 0.6) {
            console.log(`${row.sentence} : ${data.data[0].point}`);
            await this.questionBankService.addQuestionNoDuplicateToBank(
              req.body.subject,
              row.sentence,
            );
          }
        })
        .on('end', async (rowCount: any) => {
          await this.checkDuplicatedService.trainingData();
          console.warn(`Training ${rowCount} rows`);
        });

      return res.status(HttpStatus.OK).send('success');
    } catch (error) {}
  }
}

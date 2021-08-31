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

  @Post('/all')
  async checkDuplicatedAll(
    @Req() req: Request,
    @Body() questions: QuestionCheckDuplicatedDto,
    @Res() res: Response,
  ): Promise<any> {
    try {
      const user = this.authService.verifyToken(req.cookies.token.jwt_token);
      const listQuestionBank =
        await this.questionBankService.getAllQuestionBank();
      await this.historyService.createHistory(
        CONSTANTS.HISTORY_TYPE.DUPLICATE,
        questions.question,
        user.sub,
      );

      await this.checkDuplicatedService.trainingAllQuestionBank(
        listQuestionBank.map((item) => item.questionText),
      );

      const data = await this.checkDuplicatedService.checkDuplicated(
        questions.question,
        'train',
      );

      return res.status(HttpStatus.OK).send(data.data);
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).send(error);
    }
  }

  @Post('/')
  async checkDuplicated(
    @Req() req: Request,
    @Body() questions: QuestionCheckDuplicatedDto,
    @Res() res: Response,
  ): Promise<any> {
    try {
      const user = this.authService.verifyToken(req.cookies.token.jwt_token);
      const listQuestionBank =
        await this.subjectService.getQuestionBankBySubjectId(
          questions.subjectId,
        );
      await this.historyService.createHistory(
        CONSTANTS.HISTORY_TYPE.DUPLICATE,
        questions.question,
        user.sub,
      );

      await this.checkDuplicatedService.trainBankWithSubject(listQuestionBank);
      const data = await this.checkDuplicatedService.checkDuplicated(
        questions.question,
        listQuestionBank[0].subjectName,
      );

      if (!data.data) return res.status(HttpStatus.BAD_REQUEST).send(data.data);

      return res.status(HttpStatus.OK).send(data.data);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).send(error);
    }
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

      const subject = await this.subjectService.getSubjectById(
        req.body.subject,
      );

      const subjectQuestion =
        await this.subjectService.getQuestionBankBySubjectId(subject.id);

      fs.createReadStream(file.path)
        .pipe(fastCsv.parse({ headers: true }))
        .on('error', (error) => console.error(error))
        .on('data', async (row: DataTrain) => {
          if (subjectQuestion[0].questionBank.length === 0) {
            await this.questionBankService.addQuestionNoDuplicateToBank(
              req.body.subject,
              row.sentence,
            );
          } else {
            const data = await this.checkDuplicatedService.checkDuplicated(
              row.sentence,
              subject.subjectName,
            );

            if (data && data.data[0].point < 0.6) {
              console.log(`${row.sentence} : ${data.data[0].point}`);
              await this.questionBankService.addQuestionNoDuplicateToBank(
                req.body.subject,
                row.sentence,
              );
            }
          }
        })
        .on('end', async (rowCount: any) => {
          await this.checkDuplicatedService.trainingData();
          console.warn(`Training ${rowCount} rows`);
        });

      return res.status(HttpStatus.OK).send('success');
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).send(error);
    }
  }
}

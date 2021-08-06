import { AuthService } from './../auth/auth.service';
import { HistoryService } from '../services/histories.service';
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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { QuestionCheckDuplicatedDto } from 'src/dto/check-duplicated.dto';
import { CheckDuplicatedService } from 'src/services/check-duplicated.service';
import { Response, Request } from 'express';
import { v4 as uuidv4 } from 'uuid';
import * as CONSTANTS from '../constant';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';

@UseGuards(JwtAuthGuard)
@Controller('check-duplicated')
export class CheckDuplicatedController {
  constructor(
    private readonly checkDuplicatedService: CheckDuplicatedService,
    private readonly historyService: HistoryService,
    private readonly authService: AuthService,
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
    } catch (error) {
      console.log(error);
    }
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
        "Training data for duplicate model",
        user.sub,
      );

      const data = await this.checkDuplicatedService.trainingDataWithSentence(
        sentences,
      );

      return res.status(HttpStatus.OK).send(data.data);
    } catch (error) {
      console.log(error);
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
    @UploadedFile() file,
    @Res() res: Response,
  ): Promise<any> {
    try {
      const user = this.authService.verifyToken(req.cookies.token.jwt_token);
      if (user.role !== 2) return;
      // function to train
      await this.checkDuplicatedService.trainingData();

      res.status(HttpStatus.OK).send("success");
      return;
    } catch (error) {
      console.log(error);
    }
  }
}

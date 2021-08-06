import { HistoryService } from '../services/histories.service';
import {
  Param,
  Res,
  Controller,
  HttpStatus,
  UseGuards,
  Get,
} from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('history')
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @Get('/:userId/:historyId')
  async getHistoryType(
    @Res() res: Response,
    @Param('userId') userId: string,
    @Param('historyId') historyId: string,
  ): Promise<any> {
    try {
      const data = await this.historyService.getHistoryByUserAndType(
        userId,
        historyId,
      );
      return res.status(HttpStatus.OK).send(data);
    } catch (error) {
      console.error(error)
    }
  }
}

import { HistoryTypeService } from '../services/history-types.service';
import {
  Body,
  Res,
  Controller,
  HttpStatus,
  UseGuards,
  Get,
} from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('history-type')
export class HistoryTypeController {
  constructor(private readonly historyTypeService: HistoryTypeService) {}

  @Get('/')
  async getHistoryType(@Res() res: Response): Promise<any> {
    try {
      const data = await this.historyTypeService.getHistoryTypes();
      return res.status(HttpStatus.OK).send(data);
    } catch (error) {}
  }
}

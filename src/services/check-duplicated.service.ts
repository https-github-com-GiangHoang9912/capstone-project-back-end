import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import axios from 'axios';
import * as CONSTANTS from '../constant';

@Injectable()
export class CheckDuplicatedService {
  async checkDuplicated(question: string) {
    try {
      const response = await axios
        .post(`${CONSTANTS.API_MODEL_DUPLICATED}/find-duplicate`, {
          question,
        })
        .catch((err) => {
          return err;
        });
      return response;
    } catch (error) {}
  }
}

import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import axios from 'axios';
import * as CONSTANTS from '../constant';
import * as path from 'path'

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

  async trainingData() {
    try {
      const fileTrain = path.join(__dirname, '../../uploads/datasets/train.csv')
      console.log(fileTrain)
      const response = await axios
        .post(`${CONSTANTS.API_MODEL_DUPLICATED}/train-data`, {
          path: fileTrain
        })
        .catch((err) => {
          return err;
        });
      return response;
    } catch (error) {
      console.log(error)
    }
  }
}

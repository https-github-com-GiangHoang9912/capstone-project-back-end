import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import axios from 'axios';
import * as CONSTANTS from '../constant';
import * as path from 'path';

interface Sentence {
  question: string;
}

@Injectable()
export class CheckDuplicatedService {
  async checkDuplicated(question: string, questionBankName?: string) {
    try {
      const response = await axios
        .post(`${CONSTANTS.API_MODEL_DUPLICATED}/find-duplicate`, {
          question,
          subject: questionBankName
        })
        .catch((err) => {
          return err;
        });
      return response;
    } catch (error) {}
  }

  async trainBankWithSubject(subject: any) {
    try {
      const dataBank = subject[0].questionBank.map((element: any) => {
        return element.questionText
      })
      const response = await axios
        .post(`${CONSTANTS.API_MODEL_DUPLICATED}/train-data-subject`, {
          subject: subject[0].subjectName,
          dataBank,
        })
        .catch((err) => {
          return err;
        });
      return response;
    } catch (error) {}
  }

  async trainingData() {
    try {
      const fileTrain = path.join(
        __dirname,
        '../../uploads/datasets/train.csv',
      );
      console.log(fileTrain);
      const response = await axios
        .post(`${CONSTANTS.API_MODEL_DUPLICATED}/train-data`, {
          path: fileTrain,
        })
        .catch((err) => {
          return err;
        });
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  async trainingDataWithSentence(sentences: Sentence) {
    try {
      const response = await axios
        .post(`${CONSTANTS.API_MODEL_DUPLICATED}/train-data-sentence`, {
          question: sentences.question,
        })
        .catch((err) => {
          return err;
        });
      return response;
    } catch (error) {
      console.log(error);
    }
  }
}

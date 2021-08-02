import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { Exception } from 'handlebars';
import * as CONSTANTS from '../constant';

interface SelfGeneration {
  answer: string;
  context: string;
}

@Injectable()
export class SelfGenerateService {
  async generationQuestions(request: SelfGeneration[]) {
    try {
      const response = await axios
        .post(`${CONSTANTS.API_MODEL_GENERATION}`, request)
        .catch((err) => {
          return err;
        });

      if ( response.response.status !== 200 ) return {
        status: response.response.status,
        message: response.response.statusText
      }
      return response.data;
    } catch (error) {
      return error
    }
  }
}

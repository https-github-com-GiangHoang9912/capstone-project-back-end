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
    const response = await axios
      .post(`${CONSTANTS.API_MODEL_GENERATION}`, request)
      .catch((err) => {
        return err;
      });

    if (!response.data) throw new Exception('generate fail...!');

    return response.data;
  }
}

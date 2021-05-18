import { Injectable } from '@nestjs/common';

@Injectable()
export class StudentService {
  get_student(): Object {
    return {
      id: 'HE130936',
      name: 'giang',
    };
  }
}

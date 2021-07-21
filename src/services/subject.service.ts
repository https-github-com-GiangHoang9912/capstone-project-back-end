import { Subject } from './../entities/subject.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class SubjectService {
  constructor(
    @InjectRepository(Subject)
    private readonly subjectRepository: Repository<Subject>,
  ) {};

  async getSubject(): Promise<Subject[]> {
    return this.subjectRepository.find();
  };
}
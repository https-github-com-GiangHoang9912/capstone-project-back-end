import { ContactInfo } from './entities/contactInfo.entity';
import { User } from './entities/users.entity';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as CONSTANT from './constant';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(ContactInfo)
    private contactInfoRepository: Repository<ContactInfo>,
  ) {}

  async seed() {
    try {
      if (await this.userRepository.findOne({ username: 'admin' })) {
        throw new Error('admin  already exists...!');
      }

      const admin = await this.userRepository
        .create({
          username: 'admin',
          password: await bcrypt.hash(
            '12345678',
            CONSTANT.ROUND_HASH_PASSWORD.ROUND,
          ),
          role: CONSTANT.ROLE.ADMIN,
        })
        .save();

      Logger.log(admin);

      const contact = await this.contactInfoRepository
        .create({
          firstName: 'admin',
          lastName: '',
          email: 'admin@fpt.edu.vn',
          phone: '0819169868',
          address: 'Ha Noi - Vietnam',
          user: admin,
        })
        .save();

      Logger.log(contact);

      return {
        message: 'create successfully...!',
      };
    } catch (error) {
      Logger.error(error);
      return error;
    }
  }
}

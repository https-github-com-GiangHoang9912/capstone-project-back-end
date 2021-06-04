import { ContactInfo } from './entities/contactInfo.entity';
import { User } from './entities/user.entity';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ROLE } from './constant'
import * as md5 from 'md5'

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(ContactInfo) private contactInfoRepository: Repository<ContactInfo>,
  ) {}

  async seed() {
    try {
      if (await this.userRepository.findOne({userName: "admin"})) {
        throw new Error('admin  already exists...!');
      }

      const admin = await this.userRepository.create({
        userName: "admin",
        passwordEncryption: md5("12345678"),
        role: ROLE.ADMIN
      }).save()

      Logger.log(admin)

      const contact = await this.contactInfoRepository.create({
        firstName: "admin",
        email: "admin@fpt.edu.vn",
        phone: "0819169868",
        address: "Ha Noi - Vietnam",
        user: admin,
      }).save()

      Logger.log(contact)

      return {
        message: "create successfully...!"
      }
    } catch (error) {
      Logger.error(error)
      return error
    }
  }
}

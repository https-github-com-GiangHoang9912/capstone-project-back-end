import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User } from '../entities/users.entity';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendEmail(user: User, password: string) {
    const response = await this.mailerService.sendMail({
      to: user.contactInfo.email,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: 'Change password ...!',
      template: './confirmation', // `.hbs` extension is appended automatically
      context: { // ✏️ filling curly brackets with content
        name: user.contactInfo.lastName + " " + user.contactInfo.firstName,
        password: password,
      },
    });
  }
}

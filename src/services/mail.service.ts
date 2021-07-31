import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { google } from 'googleapis';
import { config } from 'dotenv';
import { User } from '../entities/users.entity';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

config();

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendEmail(user: User, password: string) {
    const response = await this.mailerService.sendMail({
      to: user.contactInfo.email,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: 'Change password ...!',
      template: './confirmation', // `.hbs` extension is appended automatically
      context: {
        // ✏️ filling curly brackets with content
        name: user.contactInfo.lastName + ' ' + user.contactInfo.firstName,
        password: password,
      },
    });
  }

  async sendGoogleEmail(user: User, password: string) {
    const oauth2Client = new google.auth.OAuth2(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      process.env.REDIRECT_URI,
    );
    oauth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

    try {
      const accessToken = await oauth2Client.getAccessToken();

      const smtpConfig = {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // use SSL
        service: 'email',
        auth: {
          type: 'OAuth2',
          user: 'giangnhhe130936@fpt.edu.vn',
          clientId: process.env.CLIENT_ID,
          clientSecret: process.env.CLIENT_SECRET,
          refreshToken: process.env.REFRESH_TOKEN,
          accessToken: accessToken,
        },
      };

      const transport = nodemailer.createTransport(
        smtpConfig as SMTPTransport.Options,
      );

      const mailOptions = {
        from: 'DDGSQ Team <giangnhhe130936@fpt.edu.vn>',
        to: user.contactInfo.email,
        subject: 'Change password ...!',
        html: `
        <div>
          <h3>
              Hello, ${
                user.contactInfo.lastName + ' ' + user.contactInfo.firstName
              } ...!
          </h3>
          <h4>
              here is your password: ${password}
          </h4>
          <h4>
              please to visit this page to change your password: http://localhost:3000/change-password
          </h4>
      </div>
        `,
      };

      const result = await transport.sendMail(mailOptions);
      return result;
    } catch (error) {
      console.log('mail.service.ts-sendGoogleEmail', error);
    }
  }
}

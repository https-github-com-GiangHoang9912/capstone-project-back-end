import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { google } from 'googleapis';
import { config } from 'dotenv';
import { User } from '../entities/users.entity';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import * as CONSTANTS from '../constant';


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
        subject: 'Request to reset password',
        html: `
          <div>
            <h3>
                Hello, ${
                  user.contactInfo.lastName + ' ' + user.contactInfo.firstName
                } ...!
            </h3>
            <h4>
              Here is your new password: ${password}
            </h4>
            <h4>
              Please follow this link to log in and change your password: https://ddsgq.xyz/change-password
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

  async sendGoogleEmailForgot(user: User) {
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
        subject: 'Request to reset password',
        html: `
        <form style="display: flex; width: 50%; margin: 20px; font-family: 'Source Sans Pro', sans-serif; text-align: center;" action="${CONSTANTS.BASE_URL}/forgot-password">
          <div>
            <h3>
              Hello, ${
                user.contactInfo.lastName + ' ' + user.contactInfo.firstName
              } ...!
            </h3>
            <h4>
              You forgot your password on DDSGQ, before being able to get new your account password you need to verify that this is your email address by clicking the button here:
            </h4>
            <button style="height: 50px;
                    background-color: #1e90ff;
                    border: none;
                    border-radius: 5px;
                    color: #fff;
                    line-height: 50px;">
              Reset Password
            </button>
            <input style="display: none" type="text" name="email" value="${
              user.contactInfo.email
            }"/>
            <h4>
              Kind Regards, DDSGQ
            </h4>
          </div>
        </form>
      `,
      };

      const result = await transport.sendMail(mailOptions);
      return result;
    } catch (error) {
      console.log('mail.service.ts-sendGoogleEmail', error);
    }
  }
}

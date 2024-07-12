//' mailer.service.ts
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as hbs from 'hbs';
import { readFileSync } from 'fs';
import { join } from 'path';

@Injectable()
export class MailerService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'mail.codenrs.com', // Replace with your SMTP host
      port: 587, // Replace with your SMTP port
      secure: false, // true for 465, false for other ports
      auth: {
        user: 'email', // Replace with your email address
        pass: 'enter password', // Replace with your email password or app-specific password
      },
    });
  }

  async sendVerificationEmail(to: string, verificationCode: string) {
    const templatePath = join(
      process.cwd(),
      'src',
      'mailer',
      'templates',
      'verification-email.hbs',
    );
    const template = readFileSync(templatePath, 'utf8');
    const compiledTemplate = hbs.compile(template);
    const html = compiledTemplate({ verificationCode });

    const mailOptions = {
      from: 'email', // Sender address
      to, // Receiver address
      subject: 'Email Verification', // Subject line
      html, // HTML body
    };

    await this.transporter.sendMail(mailOptions);
  }

  async sendPasswordResetEmail(to: string, resetCode: string) {
    const templatePath = join(
      process.cwd(),
      'src',
      'mailer',
      'templates',
      'reset-password-email.hbs',
    );
    const template = readFileSync(templatePath, 'utf8');
    const compiledTemplate = hbs.compile(template);
    const html = compiledTemplate({ resetCode });

    const mailOptions = {
      from: 'no-reply@codenrs.com', // Sender address
      to, // Receiver address
      subject: 'Password Reset', // Subject line
      html, // HTML body
    };

    await this.transporter.sendMail(mailOptions);
  }

  async sendPasswordResetSMS(phone: string, resetCode: string) {
    // Implement your SMS sending logic here
  }
}

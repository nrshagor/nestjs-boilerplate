// auth/ auth.service.ts
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { MailerService } from 'src/mailer/mailer.service';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
    private mailerService: MailerService,
  ) {}

  async validateUser(identifier: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmailOrPhone(identifier);

    if (!user) {
      throw new NotFoundException(
        'User not found with this email or phone number',
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Incorrect password');
    }

    if (user.email && !user.isEmailVerified) {
      throw new UnauthorizedException('Email is not verified');
    }

    if (user.phone && !user.isPhoneVerified) {
      throw new UnauthorizedException('Phone is not verified');
    }

    // If all checks pass, return the user object excluding the password
    const { password: _, ...result } = user;
    return result;
  }

  async login(user: any) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      phone: user.phone,
      emailVerified: user.isEmailVerified,
      phoneVerified: user.isPhoneVerified,
    };
    return {
      access_token: this.jwtService.sign(payload, {
        expiresIn: '3d', // Token expires in 3 days
      }),
    };
  }

  async register(
    username: string,
    email: string | undefined,
    phone: string | undefined,
    password: string,
    confirmPassword: string,
    role: string,
  ) {
    if (password !== confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    const newUser = await this.usersService.createUser(
      username,
      email,
      phone,
      password,
      role,
    );

    if (newUser.email) {
      const emailVerificationCode =
        await this.usersService.generateEmailVerificationCode(newUser);
      await this.mailerService.sendVerificationEmail(
        newUser.email,
        emailVerificationCode,
      );
    }

    if (newUser.phone) {
      const phoneVerificationCode =
        await this.usersService.generatePhoneVerificationCode(newUser);
      // Assume you have a method in MailerService to send SMS
      // await this.mailerService.sendVerificationSms(
      //   newUser.phone,
      //   phoneVerificationCode,
      // );
    }

    return newUser;
  }
  async verifyEmail(email: string, verificationCode: string): Promise<boolean> {
    const user = await this.usersService.findByEmailOrPhone(email);

    if (!user) {
      throw new NotFoundException('User not found with this email');
    }
    return this.usersService.verifyEmail(user, verificationCode);
  }

  async verifyPhone(phone: string, verificationCode: string): Promise<boolean> {
    const user = await this.usersService.findByEmailOrPhone(phone);

    if (!user) {
      throw new NotFoundException('User not found with this phone number');
    }
    return this.usersService.verifyPhone(user, verificationCode);
  }
  // formget password
  async requestPasswordReset(identifier: string): Promise<void> {
    const user = await this.usersService.findByEmailOrPhone(identifier);
    if (!user) {
      throw new NotFoundException(
        'User not found with this email or phone number',
      );
    }

    const resetCode = await this.usersService.generatePasswordResetCode(user);

    if (user.email === identifier) {
      await this.mailerService.sendPasswordResetEmail(user.email, resetCode);
    } else if (user.phone === identifier) {
      await this.mailerService.sendPasswordResetSMS(user.phone, resetCode); // You need to implement this method
    }
  }
  // resetPassword
  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { identifier, resetCode, newPassword, confirmPassword } =
      resetPasswordDto;

    const user = await this.usersService.findByEmailOrPhone(identifier);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.resetCode !== resetCode) {
      throw new BadRequestException('Invalid reset code');
    }

    if (newPassword !== confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetCode = null; // Clear the reset code after successful reset

    await this.usersService.save(user);

    return { message: 'Password reset successful' };
  }

  // changePassword
  async changePassword(
    userId: number,
    changePasswordDto: ChangePasswordDto,
  ): Promise<void> {
    const { oldPassword, newPassword, confirmNewPassword } = changePasswordDto;

    if (newPassword !== confirmNewPassword) {
      throw new BadRequestException('New passwords do not match');
    }

    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isOldPasswordValid) {
      throw new UnauthorizedException('Old password is incorrect');
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await this.usersService.save(user);
  }
}

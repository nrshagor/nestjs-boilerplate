import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserRole } from 'src/users/user.entity';
import { MailerService } from '../mailer/mailer.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
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
    const payload = { sub: user.id, email: user.email, role: user.role };
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
    role: UserRole = UserRole.USER,
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
}

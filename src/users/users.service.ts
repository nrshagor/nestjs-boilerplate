import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async createUser(
    username: string,
    email: string,
    phone: string,
    password: string,
    role: UserRole = UserRole.USER,
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.usersRepository.create({
      username,
      email,
      phone,
      password: hashedPassword,
      role,
    });
    return this.usersRepository.save(user);
  }

  async findByEmailOrPhone(identifier: string): Promise<User | undefined> {
    return this.usersRepository.findOne({
      where: [{ email: identifier }, { phone: identifier }],
    });
  }

  async generateEmailVerificationCode(user: User): Promise<string | null> {
    if (!user.email) return null;

    const verificationCode = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();
    user.emailVerificationCode = verificationCode;
    await this.usersRepository.save(user);
    return verificationCode;
  }

  async generatePhoneVerificationCode(user: User): Promise<string | null> {
    if (!user.phone) return null;

    const verificationCode = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();
    user.phoneVerificationCode = verificationCode;
    await this.usersRepository.save(user);
    return verificationCode;
  }

  async verifyEmail(user: User, verificationCode: string): Promise<boolean> {
    if (user.emailVerificationCode === verificationCode) {
      user.isEmailVerified = true;
      user.emailVerificationCode = null;
      await this.usersRepository.save(user);
      return true;
    }
    return false;
  }

  async verifyPhone(user: User, verificationCode: string): Promise<boolean> {
    if (user.phoneVerificationCode === verificationCode) {
      user.isPhoneVerified = true;
      user.phoneVerificationCode = null;
      await this.usersRepository.save(user);
      return true;
    }
    return false;
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './user.entity';
import * as bcrypt from 'bcrypt';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async createUser(
    firstName: string,
    email: string,
    phone: string,
    password: string,
    role: UserRole = UserRole.USER,
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.usersRepository.create({
      firstName,
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

  async generatePasswordResetCode(user: User): Promise<string> {
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetCode = resetCode;
    await this.usersRepository.save(user);
    return resetCode;
  }

  async verifyPasswordResetCode(
    user: User,
    resetCode: string,
  ): Promise<boolean> {
    return user.resetCode === resetCode;
  }
  async save(user: User): Promise<User> {
    return this.usersRepository.save(user);
  }

  async findById(id: number): Promise<User> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async updateProfile(
    userId: number,
    updateProfileDto: UpdateProfileDto,
  ): Promise<User> {
    const user = await this.findById(userId);
    Object.assign(user, updateProfileDto);
    return this.save(user);
  }

  async updateProfilePicture(
    userId: number,
    profilePictureUrl: string,
  ): Promise<User> {
    const user = await this.findById(userId);
    user.profilePictureUrl = profilePictureUrl;

    return this.save(user);
  }
  async updateProfilePictures(
    userId: number,
    profilePictureUrls: string[],
  ): Promise<User> {
    const user = await this.findById(userId);
    user.profilePictureUrls = [
      ...(user.profilePictureUrls || []),
      ...profilePictureUrls,
    ];
    return this.save(user);
  }

  async findByEmail(email: string): Promise<User> {
    return this.usersRepository.findOne({ where: { email } });
  }
}

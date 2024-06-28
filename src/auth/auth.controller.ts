// auth/auth.controller.ts

import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  Get,
  Query,
  UseGuards,
  Req,
  Put,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from 'src/users/register.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateProfileDto } from 'src/users/dto/update-profile.dto';
import { multerOptions } from 'src/multer.config';
import { UsersService } from 'src/users/users.service';
import { MailerService } from '../mailer/mailer.service';
import { FileInterceptor } from '@nestjs/platform-express';
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly usersService: UsersService,
    private readonly mailerService: MailerService,
  ) {}

  @Post('login')
  async login(@Body() body: { identifier: string; password: string }) {
    const user = await this.authService.validateUser(
      body.identifier,
      body.password,
    );
    if (!user) {
      return { message: 'Invalid credentials' };
    }
    return this.authService.login(user);
  }

  @Post('register')
  async register(@Body(new ValidationPipe()) registerDto: RegisterDto) {
    return this.authService.register(
      registerDto.firstName,
      registerDto.email,
      registerDto.phone,
      registerDto.password,
      registerDto.confirmPassword,
      registerDto.role,
    );
  }

  @Post('verify-email')
  async verifyEmail(
    @Query('email') email: string,
    @Query('code') verificationCode: string,
    @Body() body: { email: string; verificationCode: string },
  ) {
    const isVerified = await this.authService.verifyEmail(
      body.email,
      body.verificationCode,
    );
    if (isVerified) {
      return { message: 'Email verified successfully' };
    }
    return { message: 'Invalid verification code' };
  }

  @Get('verify-phone')
  async verifyPhone(
    @Query('phone') phone: string,
    @Query('code') verificationCode: string,
    @Body() body: { phone: string; verificationCode: string },
  ) {
    const isVerified = await this.authService.verifyPhone(
      body.phone,
      body.verificationCode,
    );
    if (isVerified) {
      return { message: 'Phone verified successfully' };
    }
    return { message: 'Invalid verification code' };
  }

  @Post('request-password-reset')
  async requestPasswordReset(@Body('identifier') identifier: string) {
    await this.authService.requestPasswordReset(identifier);
    return { message: 'Password reset code sent' };
  }

  @Post('reset-password')
  async resetPassword(
    @Body(new ValidationPipe()) resetPasswordDto: ResetPasswordDto,
  ) {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  async changePassword(
    @Req() req,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    const userId = req.user.userId;
    await this.authService.changePassword(userId, changePasswordDto);
    return { message: 'Password changed successfully' };
  }

  @Put('update-profile')
  @UseGuards(JwtAuthGuard)
  async updateProfile(@Req() req, @Body() updateProfileDto: UpdateProfileDto) {
    const userId = req.user.userId;
    if (updateProfileDto.newEmail) {
      const user = await this.usersService.findById(userId);
      user.newEmail = updateProfileDto.newEmail;
      await this.usersService.save(user);
      const emailVerificationCode =
        await this.usersService.generateEmailVerificationCode(user);
      await this.mailerService.sendVerificationEmail(
        user.newEmail,
        emailVerificationCode,
      );
      return { message: 'Verification email sent to new email address' };
    }
    const updatedUser = await this.usersService.updateProfile(
      userId,
      updateProfileDto,
    );
    return updatedUser;
  }

  @Put('update-profile-picture')
  @UseGuards(JwtAuthGuard)
  async updateProfilePicture(@Req() req, @Body() body: any) {
    return new Promise((resolve, reject) => {
      const upload = multerOptions.single('profilePictureUrl');
      upload(req, body, async (err) => {
        if (err) {
          console.error(err);
          reject(err);
        }
        const userId = req.user.userId;
        const profilePictureUrl = `/uploads/profile-pictures/${req.file.filename}`;
        const updatedUser = await this.usersService.updateProfilePicture(
          userId,
          profilePictureUrl,
        );
        resolve(updatedUser);
      });
    });
  }

  @Post('verify-new-email')
  @UseGuards(JwtAuthGuard)
  async verifyNewEmail(@Req() req, @Body() body: { verificationCode: string }) {
    const userId = req.user.userId;
    const user = await this.usersService.findById(userId);
    const isVerified = await this.usersService.verifyEmail(
      user,
      body.verificationCode,
    );
    if (isVerified) {
      user.email = user.newEmail;
      user.newEmail = null;
      await this.usersService.save(user);
      return { message: 'Email verified and updated successfully' };
    }
    return { message: 'Invalid verification code' };
  }
}

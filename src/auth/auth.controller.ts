import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  Get,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from 'src/users/register.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

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
      registerDto.username,
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
  ) {
    const isVerified = await this.authService.verifyPhone(
      phone,
      verificationCode,
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
}

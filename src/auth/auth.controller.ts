import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  Get,
  Query,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from 'src/users/register.dto';

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

  @Get('verify-email')
  async verifyEmail(
    @Query('email') email: string,
    @Query('code') verificationCode: string,
  ) {
    const isVerified = await this.authService.verifyEmail(
      email,
      verificationCode,
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
}

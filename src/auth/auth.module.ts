// auth/auth.module.ts

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './auth.controller';
import { MailerModule } from '../mailer/mailer.module';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '60m' },
      }),
      inject: [ConfigService],
    }),
    MailerModule,
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}

// users/register.dto.ts

import {
  IsEmail,
  IsString,
  MinLength,
  IsEnum,
  Matches,
  IsOptional,
} from 'class-validator';
import { UserRole } from './user.entity';

export class RegisterDto {
  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/, {
    message: 'Password must contain at least one letter and one number',
  })
  password: string;

  @IsString()
  phone: string;

  @IsEnum(UserRole)
  @IsOptional() // Make the role field optional
  role?: UserRole = UserRole.USER; // Default value is 'user'
}

// users/register.dto.ts

import {
  IsEmail,
  IsString,
  MinLength,
  Matches,
  IsEnum,
  IsOptional,
  ValidateIf,
} from 'class-validator';

export class RegisterDto {
  @IsString()
  firstName: string;

  @IsOptional()
  @IsEmail()
  @ValidateIf((o) => o.email !== '') // Validate only if the email is provided
  email?: string;

  @IsOptional()
  @IsString()
  @ValidateIf((o) => o.phone !== '') // Validate only if the phone is provided
  phone?: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/, {
    message: 'Password must contain at least one letter and one number',
  })
  password: string;

  @IsString()
  confirmPassword: string;

  @IsOptional() // Make the role field optional
  role?: string;
}

// auth/dto/reset-password.dto.ts

import { IsString, MinLength, Matches } from 'class-validator';

export class ResetPasswordDto {
  @IsString()
  identifier: string;

  @IsString()
  resetCode: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/, {
    message: 'Password must contain at least one letter and one number',
  })
  newPassword: string;

  @IsString()
  confirmPassword: string;
}

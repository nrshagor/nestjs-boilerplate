import { IsEmail, IsString, MinLength, IsEnum } from 'class-validator';
import { UserRole } from './user.entity';

export class RegisterDto {
  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsEnum(UserRole)
  role: UserRole;
}

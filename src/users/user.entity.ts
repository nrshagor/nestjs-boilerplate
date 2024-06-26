import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column({ unique: true, nullable: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @Column({ nullable: true })
  emailVerificationCode: string;

  @Column({ default: false })
  isEmailVerified: boolean;

  @Column({ nullable: true })
  phoneVerificationCode: string;

  @Column({ default: false })
  isPhoneVerified: boolean;

  @Column({ nullable: true })
  resetCode: string; // New column for password reset code
}

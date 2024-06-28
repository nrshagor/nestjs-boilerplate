// users/user.entity.ts

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
  firstName: string;

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

  @Column({ nullable: true })
  lastname: string;

  @Column({ nullable: true })
  division: string;

  @Column({ nullable: true })
  district: string;

  @Column({ nullable: true })
  thana: string;

  @Column({ nullable: true })
  buildingAddress: string;

  @Column({ nullable: true })
  postalCode: string;

  @Column({ nullable: true })
  profilePictureUrl: string;

  @Column({ type: 'simple-array', nullable: true })
  profilePictureUrls: string[]; // Changed to store multiple image paths

  @Column({ nullable: true })
  newEmail: string; // New email property for email change verification
}

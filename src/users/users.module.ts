// users.module.ts

import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])], // Importing TypeORM module for the User entity
  providers: [UsersService], // Providing the UsersService
  exports: [UsersService], // Exporting the UsersService to be used in other modules
})
export class UsersModule {}

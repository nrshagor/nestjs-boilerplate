import { Test, TestingModule } from '@nestjs/testing';

import { UserService } from './user.service';

describe('UserController', () => {
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService],
    }).compile();
  });

  it('should be defined', () => {});
});

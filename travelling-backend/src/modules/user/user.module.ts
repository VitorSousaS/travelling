import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from 'src/database/PrismaService';
import { UtilsService } from 'src/shared/services/utils.service';

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService, UtilsService],
  exports: [UserService],
})
export class UserModule {}

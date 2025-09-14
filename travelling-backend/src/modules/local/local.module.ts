import { Module } from '@nestjs/common';
import { LocalService } from './local.service';
import { PrismaService } from 'src/database/PrismaService';

@Module({
  exports: [LocalService],
  providers: [LocalService, PrismaService],
})
export class LocalModule {}

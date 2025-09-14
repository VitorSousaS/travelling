import { Module } from '@nestjs/common';
import { StorageService } from './storage.service';
import { PrismaService } from 'src/database/PrismaService';

@Module({
  providers: [StorageService, PrismaService],
  exports: [StorageService],
})
export class StorageModule {}

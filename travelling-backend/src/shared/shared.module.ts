import { Module } from '@nestjs/common';
import { UtilsService } from './services/utils.service';
import { PrismaService } from 'src/database/PrismaService';

@Module({
  exports: [UtilsService],
  providers: [PrismaService, UtilsService],
})
export class SharedModule {}

import { Module } from '@nestjs/common';
import { MediaController } from './media.controller';
import { StorageModule } from '../storage/storage.module';
import { PrismaService } from 'src/database/PrismaService';

@Module({
  imports: [StorageModule],
  controllers: [MediaController],
  providers: [PrismaService],
})
export class MediaModule {}

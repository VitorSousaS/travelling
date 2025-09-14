import { Module } from '@nestjs/common';
import { AttractionService } from './attraction.service';
import { AttractionController } from './attraction.controller';
import { PrismaService } from 'src/database/PrismaService';
import { StorageService } from 'src/storage/storage.service';
import { UtilsService } from 'src/shared/services/utils.service';

@Module({
  controllers: [AttractionController],
  providers: [AttractionService, PrismaService, StorageService, UtilsService],
})
export class AttractionModule {}

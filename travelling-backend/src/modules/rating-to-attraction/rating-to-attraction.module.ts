import { Module } from '@nestjs/common';
import { RatingToAttractionService } from './rating-to-attraction.service';
import { RatingToAttractionController } from './rating-to-attraction.controller';
import { PrismaService } from 'src/database/PrismaService';
import { UtilsService } from 'src/shared/services/utils.service';

@Module({
  controllers: [RatingToAttractionController],
  providers: [RatingToAttractionService, PrismaService, UtilsService],
})
export class RatingToAttractionModule {}

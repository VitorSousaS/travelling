import { Module } from '@nestjs/common';
import { RatingToEstablishmentService } from './rating-to-establishment.service';
import { RatingToEstablishmentController } from './rating-to-establishment.controller';
import { PrismaService } from 'src/database/PrismaService';
import { UtilsService } from 'src/shared/services/utils.service';

@Module({
  controllers: [RatingToEstablishmentController],
  providers: [RatingToEstablishmentService, PrismaService, UtilsService],
})
export class RatingToEstablishmentModule {}

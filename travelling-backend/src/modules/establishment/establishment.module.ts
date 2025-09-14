import { Module } from '@nestjs/common';
import { EstablishmentService } from './establishment.service';
import { EstablishmentController } from './establishment.controller';
import { PrismaService } from 'src/database/PrismaService';
import { StorageService } from 'src/storage/storage.service';
import { UtilsService } from 'src/shared/services/utils.service';
import { RatingToEstablishmentService } from '../rating-to-establishment/rating-to-establishment.service';

@Module({
  controllers: [EstablishmentController],
  providers: [
    EstablishmentService,
    PrismaService,
    StorageService,
    UtilsService,
    RatingToEstablishmentService,
  ],
})
export class EstablishmentModule {}

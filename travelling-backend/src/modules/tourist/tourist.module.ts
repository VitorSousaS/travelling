import { Module } from '@nestjs/common';
import { TouristService } from './tourist.service';
import { TouristController } from './tourist.controller';
import { PrismaService } from 'src/database/PrismaService';
import { UtilsService } from 'src/shared/services/utils.service';

@Module({
  controllers: [TouristController],
  providers: [TouristService, PrismaService, UtilsService],
})
export class TouristModule {}

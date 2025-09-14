import { Module } from '@nestjs/common';
import { TravellingService } from './travelling.service';
import { TravellingController } from './travelling.controller';
import { PrismaService } from 'src/database/PrismaService';
import { LocalService } from '../local/local.service';

@Module({
  controllers: [TravellingController],
  providers: [TravellingService, PrismaService, LocalService],
})
export class TravellingModule {}

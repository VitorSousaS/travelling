import { Module } from '@nestjs/common';
import { BusinessService } from './business.service';
import { BusinessController } from './business.controller';
import { PrismaService } from 'src/database/PrismaService';
import { UtilsService } from 'src/shared/services/utils.service';

@Module({
  controllers: [BusinessController],
  providers: [BusinessService, PrismaService, UtilsService],
})
export class BusinessModule {}

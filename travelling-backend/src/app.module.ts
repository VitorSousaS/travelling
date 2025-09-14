import { Module } from '@nestjs/common';
import { CategoryModule } from './modules/category/category.module';
import { UserModule } from './modules/user/user.module';
import { TouristModule } from './modules/tourist/tourist.module';
import { AgencyModule } from './modules/agency/agency.module';
import { BusinessModule } from './modules/business/business.module';
import { SharedModule } from './shared/shared.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { MediaModule } from './media/media.module';
import { StorageService } from './storage/storage.service';
import { EstablishmentModule } from './modules/establishment/establishment.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { AttractionModule } from './modules/attraction/attraction.module';
import { RoleGuard } from './auth/guards/role.guard';
import { TravellingModule } from './modules/travelling/travelling.module';
import { RatingToAttractionModule } from './modules/rating-to-attraction/rating-to-attraction.module';
import { RatingToEstablishmentModule } from './modules/rating-to-establishment/rating-to-establishment.module';
import { ContractModule } from './modules/contract/contract.module';
import { LocalModule } from './modules/local/local.module';

@Module({
  imports: [
    UserModule,
    TouristModule,
    AgencyModule,
    BusinessModule,
    CategoryModule,
    SharedModule,
    MediaModule,
    EstablishmentModule,
    AuthModule,
    ConfigModule.forRoot(),
    AttractionModule,
    TravellingModule,
    RatingToAttractionModule,
    RatingToEstablishmentModule,
    ContractModule,
    LocalModule,
  ],
  controllers: [],
  providers: [
    StorageService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
  ],
})
export class AppModule {}

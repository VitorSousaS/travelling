import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { Roles } from 'src/auth/decorators/roles-auth.decorator';
import { CreateRatingToEstablishmentDto } from './dto/create-ratingToestablishment.dto';
import { UpdateRatingToEstablishmentDto } from './dto/update-ratingToestablishment.dto';
import { RatingToEstablishmentService } from './rating-to-establishment.service';

@ApiTags('RatingToEstablishment')
@Controller('ratingToEstablishment')
export class RatingToEstablishmentController {
  constructor(
    private readonly ratingToEstablishmentService: RatingToEstablishmentService,
  ) {}

  @Roles('TOURIST')
  @Post('/:touristId/:establishmentId')
  @ApiOperation({
    summary: 'Serviço para atrelar uma nota a um estabelecimento.',
  })
  async create(
    @Param('touristId') touristId: string,
    @Param('establishmentId') establishmentId: string,
    @CurrentUser() user: User,
    @Body() data: CreateRatingToEstablishmentDto,
  ) {
    return this.ratingToEstablishmentService.create(
      data,
      touristId,
      establishmentId,
      user,
    );
  }

  @Roles('TOURIST')
  @Get()
  @ApiOperation({ summary: 'Serviço para listar todos as avaliações.' })
  async findAll() {
    return this.ratingToEstablishmentService.findAll();
  }

  @Roles('TOURIST')
  @Get(':id')
  @ApiOperation({
    summary: 'Serviço para buscar uma avaliação especifica com base no id.',
  })
  async findOne(@Param('id') id: string) {
    return this.ratingToEstablishmentService.findOne(id);
  }

  @Roles('TOURIST')
  @Get(':establishmentId')
  @ApiOperation({
    summary: 'Serviço para buscar um rating de um estabelecimento especifico.',
  })
  async findByEstablishment(@Param('establishmentId') establishmentId: string) {
    return this.ratingToEstablishmentService.findRatingByEstablishment(
      establishmentId,
    );
  }

  @Roles('TOURIST')
  @Put('/:touristId/:establishmentId')
  @ApiOperation({
    summary:
      'Serviço para editar os dados de uma avaliação especifico com base no id.',
  })
  async update(
    @Param('touristId') touristId: string,
    @Param('establishmentId') establishmentId: string,
    @CurrentUser() user: User,
    @Body() data: UpdateRatingToEstablishmentDto,
  ) {
    return this.ratingToEstablishmentService.update(
      touristId,
      establishmentId,
      user,
      data,
    );
  }

  @Delete('/:touristId/:establishmentId')
  @ApiOperation({
    summary: 'Serviço para deletar uma avaliação especifica com base no id.',
  })
  remove(
    @Param('touristId') touristId: string,
    @Param('establishmentId') establishmentId: string,
    @CurrentUser() user: User,
  ) {
    return this.ratingToEstablishmentService.remove(
      touristId,
      establishmentId,
      user,
    );
  }
}

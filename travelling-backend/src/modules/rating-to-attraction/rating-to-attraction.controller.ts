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
import { CreateRatingToAttractionDto } from './dto/create-ratingToAttraction.dto';
import { UpdateRatingToAttractionDto } from './dto/update-ratingToAttraction.dto';
import { RatingToAttractionService } from './rating-to-attraction.service';

@ApiTags('RatingToAttraction')
@Controller('ratingToAttraction')
export class RatingToAttractionController {
  constructor(
    private readonly ratingToAttractionService: RatingToAttractionService,
  ) {}

  @Roles('TOURIST')
  @Post('/:touristId/:attractionId')
  @ApiOperation({ summary: 'Serviço para atrelar uma nota a um atrativo.' })
  async create(
    @Param('touristId') touristId: string,
    @Param('attractionId') attractionId: string,
    @CurrentUser() user: User,
    @Body() data: CreateRatingToAttractionDto,
  ) {
    return this.ratingToAttractionService.create(
      data,
      touristId,
      attractionId,
      user,
    );
  }

  @Roles('TOURIST')
  @Get()
  @ApiOperation({ summary: 'Serviço para listar todos as avaliações.' })
  async findAll() {
    return this.ratingToAttractionService.findAll();
  }

  @Roles('TOURIST')
  @Get(':id')
  @ApiOperation({
    summary: 'Serviço para buscar uma avaliação especifica com base no id.',
  })
  async findOne(@Param('id') id: string) {
    return this.ratingToAttractionService.findOne(id);
  }

  @Roles('TOURIST')
  @Get(':attractionId')
  @ApiOperation({
    summary: 'Serviço para buscar um rating de um atrativo especifico.',
  })
  async findByAttraction(@Param('attractionId') attractionId: string) {
    return this.ratingToAttractionService.findRatingByAttraction(attractionId);
  }

  @Roles('TOURIST')
  @Put('/:touristId/:attractionId')
  @ApiOperation({
    summary:
      'Serviço para editar os dados de uma avaliação especifico com base no id.',
  })
  async update(
    @Param('touristId') touristId: string,
    @Param('attractionId') attractionId: string,
    @CurrentUser() user: User,
    @Body() data: UpdateRatingToAttractionDto,
  ) {
    return this.ratingToAttractionService.update(
      touristId,
      attractionId,
      user,
      data,
    );
  }

  @Delete('/:touristId/:attractionId')
  @ApiOperation({
    summary: 'Serviço para deletar uma avaliação especifico com base no id.',
  })
  remove(
    @Param('touristId') touristId: string,
    @Param('attractionId') attractionId: string,
    @CurrentUser() user: User,
  ) {
    return this.ratingToAttractionService.remove(touristId, attractionId, user);
  }
}

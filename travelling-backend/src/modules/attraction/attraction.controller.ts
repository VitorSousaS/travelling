import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { AttractionService } from './attraction.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { IsPublic } from 'src/auth/decorators/is-public.decorator';
import { CreateAttractionDto } from './dto/create-attraction.dto';
import { UpdateAttractionDto } from './dto/update-attraction.dto';
import { Roles } from 'src/auth/decorators/roles-auth.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from '@prisma/client';

@ApiTags('Attraction')
@Controller('attraction')
export class AttractionController {
  constructor(private readonly attractionService: AttractionService) {}

  @Roles('AGENCY')
  @Post(':agencyId')
  @ApiOperation({ summary: 'Serviço para criação de um estabelecimento.' })
  async create(
    @Param('agencyId') agencyId: string,
    @CurrentUser() user: User,
    @Body() data: CreateAttractionDto,
  ) {
    return this.attractionService.create(data, user, agencyId);
  }

  @IsPublic()
  @Get()
  @ApiOperation({ summary: 'Serviço para listar todos os atrativos.' })
  async findAll(
    @Query('name') name: string,
    @Query('minPrice') minPrice: string,
    @Query('maxPrice') maxPrice: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('location') location: string,
    @Query('averageRating') averageRating: string,
    @Query('categories') categories: string,
    @Query('interprise') interprise: string,
  ) {
    return this.attractionService.findAll({
      name,
      minPrice,
      maxPrice,
      startDate,
      endDate,
      location,
      averageRating,
      categories,
      interprise,
    });
  }

  @IsPublic()
  @Get(':id')
  @ApiOperation({
    summary: 'Serviço para buscar um atrativo especifico com base no id.',
  })
  async findOne(@Param('id') id: string) {
    return this.attractionService.findOne(id);
  }

  @Get('attractionByAgency/:agencyId')
  @ApiOperation({
    summary:
      'Serviço para buscar um atrativo especifico com base no id da agência.',
  })
  async findAttractionsByAgency(@Param('agencyId') agencyId: string) {
    return this.attractionService.findAttractionsByAgency(agencyId);
  }

  @Roles('AGENCY')
  @Put(':id')
  @ApiOperation({
    summary:
      'Serviço para editar os dados de um atrativo especifico com base no id.',
  })
  async update(
    @Param('id') id: string,
    @CurrentUser() user: User,
    @Body() data: UpdateAttractionDto,
  ) {
    return this.attractionService.update(id, user, data);
  }

  @Roles('AGENCY')
  @Delete(':id')
  @ApiOperation({
    summary: 'Serviço para deletar um atrativo especifico com base no id.',
  })
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.attractionService.remove(id, user);
  }
}

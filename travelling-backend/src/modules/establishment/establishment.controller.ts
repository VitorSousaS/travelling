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
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { EstablishmentService } from './establishment.service';
import { CreateEstablishmentDto } from './dto/create-establishment.dto';
import { UpdateEstablishmentDto } from './dto/update-establishment.dto';
import { IsPublic } from 'src/auth/decorators/is-public.decorator';
import { Roles } from 'src/auth/decorators/roles-auth.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from '@prisma/client';

@ApiTags('Establishment')
@Controller('establishment')
export class EstablishmentController {
  constructor(private readonly establishmentService: EstablishmentService) {}

  @Roles('BUSINESS')
  @Post(':businessId')
  @ApiOperation({ summary: 'Serviço para criação de um estabelecimento.' })
  async create(
    @Param('businessId') businessId: string,
    @CurrentUser() user: User,
    @Body() data: CreateEstablishmentDto,
  ) {
    return this.establishmentService.create(data, user, businessId);
  }

  @IsPublic()
  @Get()
  @ApiOperation({ summary: 'Serviço para listar todos os estabelecimentos.' })
  async findAll(
    @Query('name') name: string,
    @Query('minPrice') minPrice: string,
    @Query('maxPrice') maxPrice: string,
    @Query('openHours') openHours: string,
    @Query('closeHours') closeHours: string,
    @Query('openDays') openDays: string,
    @Query('location') location: string,
    @Query('categories') categories: string,
    @Query('averageRating') averageRating: string,
  ) {
    return this.establishmentService.findAll({
      name,
      minPrice,
      maxPrice,
      openHours,
      closeHours,
      location,
      categories,
      averageRating,
      openDays,
    });
  }

  @IsPublic()
  @Get(':id')
  @ApiOperation({
    summary:
      'Serviço para buscar um estabelecimento especifico com base no id.',
  })
  async findOne(@Param('id') id: string) {
    return this.establishmentService.findOne(id);
  }

  @Get('establishmentByBusiness/:businessId')
  @ApiOperation({
    summary:
      'Serviço para buscar um estabelecimento especifico com base no id do comércio.',
  })
  async findEstablishmentByBusiness(@Param('businessId') businessId: string) {
    return this.establishmentService.findEstablishmentByBusiness(businessId);
  }

  @Roles('BUSINESS')
  @Put(':id')
  @ApiOperation({
    summary:
      'Serviço para editar os dados de um estabelecimento especifico com base no id.',
  })
  async update(
    @Param('id') id: string,
    @CurrentUser() user: User,
    @Body() data: UpdateEstablishmentDto,
  ) {
    return this.establishmentService.update(id, user, data);
  }

  @Roles('BUSINESS')
  @Delete(':id')
  @ApiOperation({
    summary:
      'Serviço para deletar um estabelecimento especifico com base no id.',
  })
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.establishmentService.remove(id, user);
  }
}

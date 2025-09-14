import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { TravellingService } from './travelling.service';
import { CreateTravellingDto } from './dto/create-travelling.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpdateTravellingDto } from './dto/update-travelling.dto';
import { Roles } from 'src/auth/decorators/roles-auth.decorator';
import { User } from '@prisma/client';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';

@ApiTags('Travelling')
@Controller('travelling')
export class TravellingController {
  constructor(private readonly travellingService: TravellingService) {}

  @Roles('TOURIST')
  @Post(':touristId')
  @ApiOperation({ summary: 'Serviço para criação de um travelling.' })
  async create(
    @Param('touristId') touristId: string,
    @CurrentUser() user: User,
    @Body() data: CreateTravellingDto,
  ) {
    return this.travellingService.create(data, user, touristId);
  }

  @Roles('TOURIST')
  @Get()
  @ApiOperation({ summary: 'Serviço para listar todos os travellings.' })
  async findAll() {
    return this.travellingService.findAll();
  }

  @Roles('TOURIST')
  @Get(':id')
  @ApiOperation({
    summary: 'Serviço para buscar um travelling especifico com base no id.',
  })
  async findOne(@Param('id') id: string) {
    return this.travellingService.findOne(id);
  }

  @Roles('TOURIST')
  @Get('travellingsByTourist/:touristId')
  @ApiOperation({
    summary:
      'Serviço para buscar um travelling especifico com base no id do turista.',
  })
  async findByTourist(@Param('touristId') touristId: string) {
    return this.travellingService.findByTourist(touristId);
  }

  @Roles('TOURIST')
  @Put(':id')
  @ApiOperation({
    summary:
      'Serviço para editar os dados de um travelling especifico com base no id.',
  })
  async update(
    @Param('id') id: string,
    @CurrentUser() user: User,
    @Body() data: UpdateTravellingDto,
  ) {
    return this.travellingService.update(id, user, data);
  }

  @Roles('TOURIST')
  @Delete(':id')
  @ApiOperation({
    summary: 'Serviço para deletar um travelling especifico com base no id.',
  })
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.travellingService.remove(id, user);
  }
}

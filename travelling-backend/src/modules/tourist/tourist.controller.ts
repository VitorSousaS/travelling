import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { TouristService } from './tourist.service';
import { CreateTouristDto } from './dto/create-tourist.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpdateTouristDto } from './dto/update-tourist.dto';
import { IsPublic } from 'src/auth/decorators/is-public.decorator';
import { Roles } from 'src/auth/decorators/roles-auth.decorator';

@ApiTags('Tourist')
@Controller('tourist')
export class TouristController {
  constructor(private readonly touristService: TouristService) {}

  @IsPublic()
  @Post()
  @ApiOperation({ summary: 'Serviço para criação de um turista.' })
  async create(@Body() data: CreateTouristDto) {
    return this.touristService.create(data);
  }

  @Get()
  @ApiOperation({ summary: 'Serviço para listar todos os turistas.' })
  async findAll() {
    return this.touristService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Serviço para buscar um turista especifico com base no id.',
  })
  async findOne(@Param('id') id: string) {
    return this.touristService.findOne(id);
  }

  @Roles('TOURIST')
  @Put(':id')
  @ApiOperation({
    summary:
      'Serviço para editar os dados de um turista especifico com base no id.',
  })
  async update(@Param('id') id: string, @Body() data: UpdateTouristDto) {
    return this.touristService.update(id, data);
  }

  @Roles('TOURIST')
  @Delete(':id')
  @ApiOperation({
    summary: 'Serviço para deletar um turista especifico com base no id.',
  })
  remove(@Param('id') id: string) {
    return this.touristService.remove(id);
  }
}

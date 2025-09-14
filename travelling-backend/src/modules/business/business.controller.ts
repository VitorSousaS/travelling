import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { BusinessService } from './business.service';
import { CreateBusinessDto } from './Dto/create-business.dto';
import { UpdateBusinessDto } from './Dto/update-business.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { IsPublic } from 'src/auth/decorators/is-public.decorator';
import { Roles } from 'src/auth/decorators/roles-auth.decorator';

@ApiTags('Business')
@Controller('business')
export class BusinessController {
  constructor(private readonly businessService: BusinessService) {}

  @IsPublic()
  @Post()
  @ApiOperation({ summary: 'Serviço para criação de um comércio.' })
  async create(@Body() data: CreateBusinessDto) {
    return this.businessService.create(data);
  }

  @IsPublic()
  @Get()
  @ApiOperation({ summary: 'Serviço para listar todos os comércios.' })
  async findAll() {
    return this.businessService.findAll();
  }

  @IsPublic()
  @Get(':id')
  @ApiOperation({
    summary: 'Serviço para buscar um comércio especifico com base no id.',
  })
  async findOne(@Param('id') id: string) {
    return this.businessService.findOne(id);
  }

  @Roles('BUSINESS')
  @Put(':id')
  @ApiOperation({
    summary:
      'Serviço para editar os dados de um comércio especifico com base no id.',
  })
  async update(@Param('id') id: string, @Body() data: UpdateBusinessDto) {
    return this.businessService.update(id, data);
  }

  @Roles('BUSINESS')
  @Delete(':id')
  @ApiOperation({
    summary: 'Serviço para deletar um comércio especifico com base no id.',
  })
  remove(@Param('id') id: string) {
    return this.businessService.remove(id);
  }
}

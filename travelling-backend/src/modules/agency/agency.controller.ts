import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { AgencyService } from './agency.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateAgencyDto } from './dto/create-agency.dto';
import { UpdateAgencyDto } from './dto/update-agency.dto';
import { IsPublic } from 'src/auth/decorators/is-public.decorator';
import { Roles } from 'src/auth/decorators/roles-auth.decorator';

@ApiTags('Agency')
@Controller('agency')
export class AgencyController {
  constructor(private readonly agencyService: AgencyService) {}

  @IsPublic()
  @Post()
  @ApiOperation({ summary: 'Serviço para criação de uma agência.' })
  async create(@Body() data: CreateAgencyDto) {
    return this.agencyService.create(data);
  }

  @IsPublic()
  @Get()
  @ApiOperation({ summary: 'Serviço para listar todas as agências.' })
  async findAll() {
    return this.agencyService.findAll();
  }

  @IsPublic()
  @Get(':id')
  @ApiOperation({
    summary: 'Serviço para buscar uma agência especifica com base no id.',
  })
  async findOne(@Param('id') id: string) {
    return this.agencyService.findOne(id);
  }

  @Roles('AGENCY')
  @Put(':id')
  @ApiOperation({
    summary:
      'Serviço para editar os dados de uma agência especifica com base no id.',
  })
  async update(@Param('id') id: string, @Body() data: UpdateAgencyDto) {
    return this.agencyService.update(id, data);
  }

  @Roles('AGENCY')
  @Delete(':id')
  @ApiOperation({
    summary: 'Serviço para deletar uma agência especifica com base no id.',
  })
  remove(@Param('id') id: string) {
    return this.agencyService.remove(id);
  }
}

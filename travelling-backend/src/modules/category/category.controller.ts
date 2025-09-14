import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { IsPublic } from 'src/auth/decorators/is-public.decorator';

@ApiTags('Category')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @ApiOperation({ summary: 'Serviço para criação de uma categoria.' })
  async create(@Body() data: CreateCategoryDto) {
    return this.categoryService.create(data);
  }

  @IsPublic()
  @Get()
  @ApiOperation({ summary: 'Serviço para listar todas as categorias.' })
  async findAll() {
    return this.categoryService.findAll();
  }

  @IsPublic()
  @Get(':id')
  @ApiOperation({
    summary: 'Serviço para buscar uma categoria especifica com base no id.',
  })
  async findOne(@Param('id') id: string) {
    return this.categoryService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({
    summary:
      'Serviço para editar os dados de uma categoria especifica com base no id.',
  })
  async update(@Param('id') id: string, @Body() data: UpdateCategoryDto) {
    return this.categoryService.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Serviço para deletar uma categoria especifica com base no id.',
  })
  remove(@Param('id') id: string) {
    return this.categoryService.remove(id);
  }
}

import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { IsPublic } from 'src/auth/decorators/is-public.decorator';

@ApiTags('Users')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @IsPublic()
  @Post('admin')
  @ApiOperation({ summary: 'Serviço para criação de um usuário admin.' })
  async create(@Body() data: CreateUserDto) {
    return this.userService.create(data);
  }

  @Get()
  @ApiOperation({
    summary: 'Serviço para buscar todos os usuários.',
  })
  async findAll() {
    return this.userService.findAll();
  }

  @Get('/userById/:id')
  @ApiOperation({
    summary: 'Serviço para buscar um usuário pelo seu id.',
  })
  async findById(@Param('id') id: string) {
    return this.userService.findById(id);
  }

  @Get(':email')
  @ApiOperation({
    summary: 'Serviço para buscar um usuário pelo seu email.',
  })
  async findByEmail(@Param('email') email: string) {
    return this.userService.findByEmail(email);
  }
}

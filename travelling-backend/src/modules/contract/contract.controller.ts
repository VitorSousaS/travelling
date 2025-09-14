import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ContractService } from './contract.service';
import { UpdateContractDto } from './dto/update-contract.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles-auth.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from '@prisma/client';

@ApiTags('Contract')
@Controller('contract')
export class ContractController {
  constructor(private readonly contractService: ContractService) {}

  @Roles('TOURIST')
  @Post('/:attractionId/:agencyId/:touristId')
  @ApiOperation({
    summary: 'Serviço para criação de um contrato entre agência e turista.',
  })
  create(
    @Param('attractionId') attractionId: string,
    @Param('agencyId') agencyId: string,
    @Param('touristId') touristId: string,
  ) {
    return this.contractService.create(attractionId, agencyId, touristId);
  }

  @Get()
  @ApiOperation({
    summary: 'Serviço para buscar todos os contratos.',
  })
  findAll() {
    return this.contractService.findAll();
  }

  @Get(':id')
  @Roles('TOURIST', 'AGENCY')
  @ApiOperation({
    summary: 'Serviço para buscar um contrato entre agência e turista.',
  })
  findOne(@Param('id') id: string) {
    return this.contractService.findOne(id);
  }

  @Get('contractsByTourist/:touristId')
  @Roles('TOURIST')
  @ApiOperation({
    summary: 'Serviço para buscar os contratos vinculadas à um turista.',
  })
  findByTourist(@Param('touristId') touristId: string) {
    return this.contractService.findByTourist(touristId);
  }

  @Get('contractsByAgency/:agencyId')
  @Roles('AGENCY')
  @ApiOperation({
    summary: 'Serviço para buscar os contratos vinculadas à uma agência.',
  })
  findByAgency(@Param('agencyId') agencyId: string) {
    return this.contractService.findByAgency(agencyId);
  }

  @Patch('/:id')
  @Roles('AGENCY')
  @ApiOperation({
    summary: 'Serviço para editar um contrato entre agência e turista.',
  })
  update(
    @Param('id') id: string,
    @CurrentUser() user: User,
    @Body() data: UpdateContractDto,
  ) {
    return this.contractService.update(id, user, data);
  }

  @Delete(':id')
  @Roles('TOURIST', 'AGENCY')
  @ApiOperation({
    summary: 'Serviço para deletar um contrato entre agência e turista.',
  })
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.contractService.remove(id, user);
  }

  @Delete('/forceRemove/:id')
  @Roles('TOURIST', 'AGENCY')
  @ApiOperation({
    summary: 'Serviço para deletar um contrato entre agência e turista.',
  })
  removeFromDatabase(@Param('id') id: string, @CurrentUser() user: User) {
    return this.contractService.removeFromDatabase(id, user);
  }
}

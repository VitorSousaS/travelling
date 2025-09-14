import { ContractStatus } from '@prisma/client';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateContractDto } from './create-contract.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateContractDto extends PartialType(CreateContractDto) {
  @ApiProperty({
    example: 'CONFIRMED',
  })
  @IsNotEmpty()
  @IsString()
  status: ContractStatus;
}

import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';
import { CreateLocalDto } from './create-local.dto';
import { LocalType } from '@prisma/client';

export class UpdateLocalDto extends PartialType(CreateLocalDto) {
  @ApiProperty({
    example: '97095411-6264-49d4-9144-3cd41ce698d5',
  })
  @IsString()
  localId: string;

  @ApiProperty({
    example: 1,
  })
  @IsInt()
  position: number;

  @ApiProperty({
    example: 'attraction',
  })
  @IsString()
  type: LocalType;
}

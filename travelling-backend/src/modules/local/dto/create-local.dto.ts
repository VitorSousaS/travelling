import { ApiProperty } from '@nestjs/swagger';
import { LocalType } from '@prisma/client';
import { IsInt, IsString } from 'class-validator';

export class CreateLocalDto {
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

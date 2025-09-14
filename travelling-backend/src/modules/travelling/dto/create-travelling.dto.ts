import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { LocalType } from '@prisma/client';
import { IsArray, IsString } from 'class-validator';
import { CreateLocalDto } from 'src/modules/local/dto/create-local.dto';

export type LocalTypeRegister = {
  type: LocalType;
  position: number;
  localId: string;
};

export class CreateTravellingDto {
  @ApiProperty({
    example: 'Bonito com os amigos',
  })
  @IsString()
  title: string;

  @ApiPropertyOptional({
    isArray: true,
  })
  @IsArray()
  locals: CreateLocalDto[];
}

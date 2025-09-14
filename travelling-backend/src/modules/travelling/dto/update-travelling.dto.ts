import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  CreateTravellingDto,
  LocalTypeRegister,
} from './create-travelling.dto';
import { IsArray, IsString } from 'class-validator';

export class UpdateTravellingDto extends PartialType(CreateTravellingDto) {
  @ApiProperty({
    example: 'Bonito com a familia',
  })
  @IsString()
  title: string;

  @ApiPropertyOptional({
    isArray: true,
    type: 'string',
  })
  @IsArray()
  locals: LocalTypeRegister[];
}

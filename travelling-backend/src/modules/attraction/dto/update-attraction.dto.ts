import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateAttractionDto } from './create-attraction.dto';
import {
  IsArray,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class UpdateAttractionDto extends PartialType(
  CreateAttractionDto,
) {
  @ApiProperty({
    example: 'Balneário Camburiú',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'https://gcp.com/media/image',
  })
  @IsString()
  banner: string;

  @ApiProperty({
    example: '2023-09-25T13:30:00-03:00',
  })
  @IsString()
  date: string;

  @ApiProperty({
    example:
      'Brazil, MS, Bonito, LáLonge, Na Fazendo do seu Zé, 1299',
  })
  @IsString()
  location: string;

  @ApiProperty({
    example: 'Lugar bonito e cheiroso',
  })
  @IsString()
  foundInAttraction: string;

  @ApiProperty({
    example: 'Boing 347',
  })
  @IsString()
  notFoundInAttraction: string;

  @ApiProperty({
    isArray: true,
    type: 'string',
  })
  @IsArray()
  @IsNotEmpty()
  categories: string[];

  @ApiPropertyOptional({
    isArray: true,
    type: 'string',
  })
  @IsArray()
  generalMedias: string[];

  @ApiProperty({
    example: '3000',
  })
  @IsString()
  pricing: string;

  @ApiProperty({
    example: 'Espaço aberto para estar com a família',
  })
  @IsString()
  description: string;

  @ApiPropertyOptional({
    isArray: true,
    type: 'string',
  })
  @IsArray()
  whatToTake: string[];
}

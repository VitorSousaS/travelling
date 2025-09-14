import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateAttractionDto {
  @ApiProperty({
    example: 'Buraco do padre',
  })
  @IsString()
  name: string;

  @ApiPropertyOptional({
    example: 'https://gcp.com/media/image',
  })
  @IsString()
  banner: string;

  @ApiProperty({
    example: '2023-09-25T09:00:00-00:00',
  })
  @IsString()
  date: string;

  @ApiProperty({
    example: 'Brazil, PA, Curitiba, Itaiacoca, No meio do mato, -1',
  })
  @IsString()
  location: string;

  @ApiProperty({
    example:
      'Um lugar agradável e bem arborizado, bom para passar a amanhã e fazer um piquenique',
  })
  @IsString()
  foundInAttraction: string;

  @ApiProperty({
    example: 'Civilização',
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
    example: '12000',
  })
  @IsString()
  pricing: string;

  @ApiProperty({
    example:
      'Para pessoas que gostam de um lugar tranquilo e importante saber nadar para ter 100% do priveito do atrativo',
  })
  @IsString()
  description: string;

  @ApiProperty({
    isArray: true,
    type: 'string',
  })
  @IsArray()
  whatToTake: string[];
}

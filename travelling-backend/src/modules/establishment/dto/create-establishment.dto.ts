import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateEstablishmentDto {
  @ApiProperty({
    example: 'Fome Minha',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'Um belo local',
  })
  @IsString()
  description: string;

  @ApiPropertyOptional({
    example: 'https://gcp.com/media/image',
  })
  @IsString()
  banner: string;

  @ApiProperty({
    example: '2023-09-25T13:30:00-03:00',
  })
  @IsString()
  openHours: string;

  @ApiProperty({
    example: '2023-09-25T23:00:00-03:00',
  })
  @IsString()
  closeHours: string;

  @ApiProperty({
    example: '120',
  })
  @IsString()
  minPrice: string;

  @ApiProperty({
    example: '350',
  })
  @IsString()
  maxPrice: string;

  @ApiProperty({
    example:
      'Brazil, SP, Andradina, Pioeniros, Av. Senador Antônio Mendes Canalle, 1299',
  })
  @IsString()
  location: string;

  @ApiProperty({
    example: ['Segunda', 'Terça', 'Sexta'],
  })
  @IsArray()
  @IsNotEmpty()
  openDays: string[];

  @ApiProperty({
    example: 'Variações de pratos feitos e petiscos da cultura local',
  })
  @IsString()
  foundInEstablishment: string;

  @ApiProperty({
    example: 'Temos espaço para pesca esportiva',
  })
  @IsString()
  otherInformation: string;

  @ApiPropertyOptional({
    example: '+550670000990',
  })
  @MinLength(11, {
    message: 'Phone number is too short',
  })
  @IsString()
  phone: string;

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

  @ApiPropertyOptional({
    isArray: true,
    type: 'string',
  })
  @IsArray()
  menuOfServicesMedia: string[];
}

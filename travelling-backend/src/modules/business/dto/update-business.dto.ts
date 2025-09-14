import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateBusinessDto } from './create-business.dto';
import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';

export class UpdateBusinessDto extends PartialType(CreateBusinessDto) {
  @ApiProperty({
    example: 'Restaurante do Jacquin',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: '+550673500990',
  })
  @MinLength(11, {
    message: 'Phone number is too short',
  })
  @IsString()
  phone: string;

  @ApiProperty({
    example: 'tadurosdormes@email.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    readOnly: true,
    example: 'mypassword123',
  })
  @IsString()
  @MinLength(8, {
    message: 'Password is too short',
  })
  password: string;
}

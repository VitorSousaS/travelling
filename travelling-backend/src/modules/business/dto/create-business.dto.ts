import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateBusinessDto {
  @ApiProperty({
    example: 'TadurosDormes',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: '+550670000990',
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
    example: 'mypassword123',
  })
  @IsString()
  @MinLength(8, {
    message: 'Password is too short',
  })
  password: string;
}

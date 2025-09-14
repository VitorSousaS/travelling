import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateTouristDto } from './create-tourist.dto';
import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  MinLength,
} from 'class-validator';

export class UpdateTouristDto extends PartialType(CreateTouristDto) {
  @ApiProperty({
    example: 'Tayler',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'Durden',
  })
  @IsString()
  lastname: string;

  @ApiProperty({
    example: 27,
  })
  @IsNumber()
  age: number;

  @ApiProperty({
    example: '+5506704500000',
  })
  @MinLength(11, {
    message: 'Phone number is too short',
  })
  @IsString()
  phone: string;

  @ApiProperty({
    example: 'taylerd@email.com',
  })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({
    example: 'mypassword123',
  })
  @IsString()
  @MinLength(8, {
    message: 'Password is too short',
  })
  password: string;

  @ApiPropertyOptional({
    isArray: true,
    type: 'string',
  })
  @IsArray()
  @IsNotEmpty()
  favoriteCategories: string[];
}

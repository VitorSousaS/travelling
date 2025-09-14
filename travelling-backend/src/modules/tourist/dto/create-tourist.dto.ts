import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateTouristDto {
  @ApiProperty({
    example: 'John',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'Doe',
  })
  @IsString()
  lastname: string;

  @ApiProperty({
    example: 23,
  })
  @IsNumber()
  age: number;

  @ApiProperty({
    example: '+55067005400000',
  })
  @MinLength(11, {
    message: 'Phone number is too short',
  })
  @IsString()
  phone: string;

  @ApiProperty({
    example: 'johndoe@email.com',
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

  @ApiPropertyOptional({
    isArray: true,
    type: 'string',
  })
  @IsArray()
  @IsNotEmpty()
  favoriteCategories: string[];
}

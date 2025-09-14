import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'admin',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: '+55067005400000',
  })
  @MinLength(11, {
    message: 'Phone number is too short',
  })
  @IsString()
  phone: string;

  @ApiProperty({
    example: 'admin@email.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '2022@admin',
  })
  @IsString()
  @MinLength(8, {
    message: 'Password is too short',
  })
  password: string;
}

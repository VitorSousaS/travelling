import { ApiProperty } from '@nestjs/swagger';
import { Contains, IsEmail, IsString, MinLength } from 'class-validator';

export class CreateAgencyDto {
  @ApiProperty({
    example: 'Tree Trip',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: '+5506700000000',
  })
  @MinLength(11, {
    message: 'Phone number is too short',
  })
  @IsString()
  phone: string;

  @ApiProperty({
    example: 'treetrip@email.com',
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

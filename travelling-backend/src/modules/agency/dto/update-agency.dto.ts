import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateAgencyDto } from './create-agency.dto';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class UpdateAgencyDto extends PartialType(CreateAgencyDto) {
  @ApiProperty({
    example: 'Trip Tree',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: '+5506700110000',
  })
  @MinLength(11, {
    message: 'Phone number is too short',
  })
  @IsString()
  phone: string;

  @ApiProperty({
    example: 'triptree@email.com',
  })
  @IsEmail()
  email: string;
}

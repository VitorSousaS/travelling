import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    example: 'Ar livre',
  })
	@IsNotEmpty()
  @IsString()
  title: string;
}

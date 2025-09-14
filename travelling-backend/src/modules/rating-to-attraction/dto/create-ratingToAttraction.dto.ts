import { ApiProperty,  } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CreateRatingToAttractionDto {
  @ApiProperty({
    example: '0.5',
  })
  @IsNumber()
  value: number;
}

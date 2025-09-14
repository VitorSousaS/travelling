import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CreateRatingToEstablishmentDto {
  @ApiProperty({
    example: '0.5',
  })
  @IsNumber()
  value: number;
}

import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateRatingToEstablishmentDto } from './create-ratingToEstablishment.dto';
import { IsNumber } from 'class-validator';

export class UpdateRatingToEstablishmentDto extends PartialType(
  CreateRatingToEstablishmentDto,
) {
  @ApiProperty({
    example: '4',
  })
  @IsNumber()
  value: number;
}

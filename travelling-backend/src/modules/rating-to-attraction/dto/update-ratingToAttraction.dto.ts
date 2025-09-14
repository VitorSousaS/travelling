import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateRatingToAttractionDto } from './create-ratingToAttraction.dto';
import { IsNumber } from 'class-validator';

export class UpdateRatingToAttractionDto extends PartialType(
  CreateRatingToAttractionDto,
) {
  @ApiProperty({
    example: '4',
  })
  @IsNumber()
  value: number;
}

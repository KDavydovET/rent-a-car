import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export default class RentCostDto {
  @ApiProperty({
    example: '15',
    description: 'Number of days in rent session (difference between start date and end date)',
  })
  @IsNotEmpty()
  days: number;
}
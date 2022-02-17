import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Validate } from 'class-validator';
import { isDate } from '../validators/date.validator';

export default class RentAvailabilityDto {
  @ApiProperty({
    example: '2022-01-01',
    description: 'Date the car will become available',
  })
  @IsNotEmpty()
  @Validate(isDate)
  startDate: string;

  @ApiProperty({
    example: '2022-01-30',
    description: 'Date the car will become unavailable',
  })
  @IsNotEmpty()
  @Validate(isDate)
  endDate: string;
}
import { ApiProperty } from '@nestjs/swagger';
import {
  isDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Validate,
} from 'class-validator';
import { IsValidDay } from '../validators/weekday.validator';

export default class RentCreateDto {
  @ApiProperty({
    example: 'A111AA',
    description: 'Car\'s license plate',
  })
  @IsNotEmpty()
  license_plate: string;

  @ApiProperty({
    example: '2022-01-01',
    description: 'Starting date of the rent session',
  })
  @IsNotEmpty()
  @Validate(isDate)
  @Validate(IsValidDay)
  startDate: string;

  @ApiProperty({
    example: '2022-01-30',
    description: 'Ending date of the rent session',
  })
  @IsNotEmpty()
  @Validate(isDate)
  @Validate(IsValidDay)
  endDate: string;
}
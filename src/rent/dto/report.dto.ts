import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Validate } from 'class-validator';
import { isDate } from '../validators/date.validator';

export default class ReportDto {
  @ApiProperty({
    example: '2022-01',
    description: 'Month of the report',
  })
  @IsNotEmpty()
  @Validate(isDate)
  month: string;
}
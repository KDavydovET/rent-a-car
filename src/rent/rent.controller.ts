import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { RentService } from './rent.service';
import RentAvailabilityDto from './dto/rent.availability.dto';
import RentCreateDto from './dto/rent.create.dto';

import ReportDto from './dto/report.dto';
import RentCostDto from './dto/rent.cost.dto';

@Controller('rent')
export class RentController {
  constructor(private readonly rentService: RentService) {}

  @Get('/availability')
  checkCarAvailability(@Query() carAvailabilityDto: RentAvailabilityDto) {
    return this.rentService.checkCarsAvailability(carAvailabilityDto);
  }

  @Get('/cost')
  calculateCost(@Query() rentCostDto: RentCostDto) {
    return this.rentService.calculateCost(rentCostDto.days);
  }

  @Post()
  insertRent(@Body() rentCreateDto: RentCreateDto) {
    return this.rentService.insertRent(rentCreateDto);
  }

  @Get('/report')
  sendReport(@Query() reportDto: ReportDto) {
    return this.rentService.sendReport(reportDto);
  }
}
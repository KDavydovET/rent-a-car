import { Injectable, Logger } from '@nestjs/common';
import * as dayjs from 'dayjs';
import { DatabaseService } from '../database/database.service';
import responseWrapper from '../utils/wrappers';
import ReportDto from './dto/report.dto';
import RentAvailabilityDto from './dto/rent.availability.dto';
import RentCreateDto from './dto/rent.create.dto';
import RentCostDto from './dto/rent.cost.dto';

@Injectable()
export class RentService {
  private readonly logger = new Logger(RentService.name);

  constructor(private databaseService: DatabaseService) {}

  getDaysDif(start: string, end: string): number {
    const startDate = dayjs(start, 'YYYY-MM-DD');
    const endDate = dayjs(end, 'YYYY-MM-DD');

    return endDate.diff(startDate, 'day') + 1;
  }

  calculateCost(days) {

    let end = days || days + 1;
    let total_cost = 0;

    if (days >= 18) {
      total_cost = (end - 17) * 1000 * 0.85 + this.calculateCost(17).cost;
    } else if (days >= 10) {
      total_cost = (end - 9) * 1000 * 0.9 + this.calculateCost(9).cost;
    } else if (days >= 5) {
      total_cost = (end - 4) * 1000 * 0.95 + this.calculateCost(4).cost;
    } else {
      total_cost = end * 1000;
    }

    return { 
      cost: total_cost,
      discount: parseInt(`${days * 1000 - total_cost}`)
    };
  }

  async checkCarsAvailability(carAvailabilityDto: RentAvailabilityDto) {
    const { startDate, endDate } = carAvailabilityDto;
    const cars = await this.databaseService.executeQuery(
      `SELECT * FROM "CARS" WHERE CAR_ID NOT IN(SELECT car_id FROM "RENT" WHERE '${startDate} ' < end_date AND '${endDate}' > start_date)`,
    );
    return responseWrapper.responseSucces(cars);
  }

  async insertRent(rentCreateDto: RentCreateDto) {
    const {
      license_plate,
      startDate,
      endDate
    } = rentCreateDto;
    const difference = this.getDaysDif(startDate, endDate);
    if (difference > 30) {
      return responseWrapper.responseError('Rent session can not be longer than 30 days');
    }

    const lastAllowedRentEndDate = dayjs(startDate)
      .subtract(3, 'day')
      .format('YYYY-MM-DD');

    const cars = await this.databaseService.executeQuery(
      `SELECT * FROM "CARS" WHERE CAR_ID NOT IN(SELECT car_id FROM "RENT" WHERE '${lastAllowedRentEndDate} ' < end_date AND '${endDate}' > start_date) AND license_plate='${license_plate}'`,
    );

    if (!cars[0]) {
      return responseWrapper.responseError(
        'No available cars for desired period.',
      );
    }

    const { cost, discount } = this.calculateCost(
      difference
    );

    await this.databaseService.executeQuery(
      `INSERT INTO "RENT" (car_id, start_date, end_date, cost)
      VALUES (${cars[0].car_id}, '${startDate}', '${endDate}', ${cost})`,
    );
    return responseWrapper.responseSucces({ cost, discount });
  }

  async sendReport(reportDto: ReportDto) {
    const { month } = reportDto;
    let rent;

    const startDate = dayjs(month).startOf('month').format('YYYY-MM-DD');
    const endDate = dayjs(month).endOf('month').format('YYYY-MM-DD');
    const daysInMonth = dayjs(month).daysInMonth();

    try {
      rent = await this.databaseService.executeQuery(
        `SELECT start_date, end_date, license_plate FROM "RENT" JOIN "CARS" ON "CARS"."car_id" = "RENT"."car_id" WHERE '${startDate}' < end_date AND '${endDate}' > start_date`,
      );
    } catch (err) {
      this.logger.error(err);
    }

    const rentDaysByCar: Record<string, number> = rent.reduce(
      (acc, curr) => {
        let { start_date, end_date } = curr;
        const { license_plate } = curr;

        if (dayjs(start_date).format('MMMM') !== dayjs(month).format('MMMM')) {
          start_date = startDate;
        }

        if (dayjs(end_date).format('MMMM') !== dayjs(month).format('MMMM')) {
          end_date = endDate;
        }
        const days = this.getDaysDif(start_date, end_date);

        !acc[license_plate]
          ? (acc[license_plate] = days)
          : (acc[license_plate] += days);

        return acc;
      },
      {},
    );

    const report = Object.entries(rentDaysByCar).reduce((acc, curr) => {
      const percent = (curr[1] / daysInMonth) * 100;
      acc[curr[0]] = { percent: `${percent.toFixed(2)}%` };
      return acc;
    }, {});

    let unusedCars;
    const usedCars = Object.keys(rentDaysByCar).map((car) => `'${car}'`);

    try {
      unusedCars = await this.databaseService.executeQuery(
        `SELECT license_plate FROM "CARS" WHERE license_plate NOT IN (${usedCars})`,
      );
    } catch (error) {}

    unusedCars.forEach((car) => {
      report[car.license_plate] = {
        percent: '0%',
      };
    });

    const allPercent: { percent: string }[] = Object.values(report);

    const total = allPercent.reduce((acc, curr) => {
      return (acc += parseFloat(curr.percent));
    }, 0);

    return { report, total: `${(total / allPercent.length).toFixed(2)}%` };
  }
}
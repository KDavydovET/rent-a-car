import { Injectable, OnModuleInit } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import * as faker from 'faker';
import * as dayjs from 'dayjs';
import { RentService } from 'src/rent/rent.service';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(
    private databaseService: DatabaseService,
    private rentService: RentService,
  ) {}

  async seed(): Promise<void> {
    let carsTableCreated = false;
    let rentTableCreated = false;

    const tableCars = await this.databaseService.executeQuery(
      `SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME='CARS'`,
    );
    const tableRent = await this.databaseService.executeQuery(
      `SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME='RENT'`,
    );

    if (!tableCars[0]) {
      await this.databaseService.executeQuery(
        `CREATE TABLE "CARS" (
        car_id SERIAL NOT NULL PRIMARY KEY,
        license_plate VARCHAR(6)
    );`,
      );
      carsTableCreated = true;
    }

    if (!tableRent[0]) {
      await this.databaseService.executeQuery(
        `CREATE TABLE "RENT" (
          id SERIAL NOT NULL PRIMARY KEY,
          car_id integer NOT NULL,
          start_date date NOT NULL,
          end_date date NOT NULL,
          cost INT NOT NULL,
          CONSTRAINT fk_car_id
            FOREIGN KEY(car_id) 
              REFERENCES "CARS"(car_id)
    );`,
      );
      rentTableCreated = true;
    }

    const carsData = [];
    const rentData = [];

    if (carsTableCreated) {
      for (let i = 0; i < 5; i++) {
        const optionNumber = {
          min: 0,
          max: 9,
        };
        const optionAlpha = {
          upcase: true,
        };
        const license_plate = `${faker.random.alpha(optionAlpha)}` +
                              `${faker.datatype.number(optionNumber)}` +
                              `${faker.datatype.number(optionNumber)}` +
                              `${faker.datatype.number(optionNumber)}` +
                              `${faker.random.alpha(optionAlpha)}` +
                              `${faker.random.alpha(optionAlpha)}`;
        carsData.push(`('${license_plate}')`);
      }

      await this.databaseService.executeQuery(
        `INSERT INTO "CARS" (license_plate)
        VALUES ${carsData}`,
      );
    }

    if (rentTableCreated) {
      for (let i = 1; i < 10; i++) {
        const carId = faker.datatype.number({
          min: 1,
          max: 5,
        });
        const randomNumber = faker.datatype.number({
          min: 1,
          max: 30,
        });
        const startDate = dayjs(
          faker.date.between('2022-01-01', '2022-03-01'),
        ).format('YYYY-MM-DD');

        const endDate = dayjs(startDate)
          .add(randomNumber, 'day')
          .format('YYYY-MM-DD');
        const date = [startDate, endDate];
        date.sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

        const difference = this.rentService.getDaysDif(date[0], date[1]);
        const { cost } = this.rentService.calculateCost(difference);

        rentData.push(
          `(${carId}, '${date[0]}', '${date[1]}', ${cost})`,
        );
      }

      await this.databaseService.executeQuery(
        `INSERT INTO "RENT" (car_id, start_date, end_date, cost)
        VALUES ${rentData}`,
      );
    }
  }
  async onModuleInit(): Promise<void> {
    await this.seed();
  }
}

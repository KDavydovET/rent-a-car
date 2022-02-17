import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseService } from '../database/database.service';
import { RentService } from './rent.service';

describe('ReservationsService', () => {
  let service: RentService;
  const mockRepository = {
    executeQuery() {
      return [
        {
          id: 1,
          licence_plate: 'R987MM',
        },
      ];
    },
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RentService,
        { provide: DatabaseService, useValue: mockRepository },
      ],
    }).compile();

    service = module.get<RentService>(RentService);
  });

  describe('getDaysDif', () => {
    it('Should calculate the day difference for the period.', async () => {
      const item1 = {
        start: '2022-01-01',
        end: '2022-01-02',
      };

      const item2 = {
        start: '2022-07-24',
        end: '2022-07-30',
      };

      const item3 = {
        start: '2022-02-01',
        end: '2022-02-11',
      };

      const desiredResult1 = 2;
      const result1 = service.getDaysDif(item1.start, item1.end);

      expect(result1).toEqual(desiredResult1);

      const desiredResult2 = 7;
      const result2 = service.getDaysDif(item2.start, item2.end);

      expect(result2).toEqual(desiredResult2);

      const desiredResult3 = 11;
      const result3 = service.getDaysDif(item3.start, item3.end);

      expect(result3).toEqual(desiredResult3);
    });
  });

  describe('calculateCost', () => {
    it('Should calculate the cost of renting a car based on the number of rent days.', async () => {
      const item1 = {
        days: 3,
      };

      const item2 = {
        days: 11,
      };

      const item3 = {
        days: 18,
      };

      const desiredResult1 = { cost: 3000, discount: 0 };
      const result1 = service.calculateCost(item1.days);
      expect(result1).toEqual(desiredResult1);

      const desiredResult2 = { cost: 10550, discount: 450 };
      const result2 = service.calculateCost(item2.days);
      expect(result2).toEqual(desiredResult2);

      const desiredResult3 = { cost: 16800, discount: 1200 };
      const result3 = service.calculateCost(item3.days);
      expect(result3).toEqual(desiredResult3);
    });
  });

  describe('checkCarsAvailability', () => {
    it('should return the rent object', async () => {
      const item1 = {
        startDate: '2022-01-01',
        endDate: '2022-02-01',
        licence_plate: 'R987MM',
      };
      const expectedResult = [
        {
          id: 1,
          licence_plate: 'R987MM',
        },
      ];

      const { data } = await service.checkCarsAvailability(item1);
      expect(data).toEqual(expectedResult);
    });
  });
});
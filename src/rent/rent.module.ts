import { Module } from '@nestjs/common';
import { RentService } from './rent.service';
import { RentController } from './rent.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [RentService],
  controllers: [RentController],
  exports: [RentService],
})
export class RentModule {}
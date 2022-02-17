import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { SeedService } from './seed.service';
import { RentModule } from 'src/rent/rent.module';

@Module({
  imports: [DatabaseModule, RentModule],
  providers: [SeedService],
})
export class SeedModule {}
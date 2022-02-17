import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { RentController } from './rent/rent.controller';
import { RentModule } from './rent/rent.module';
import { SeedModule } from './seed/seed.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    DatabaseModule,
    RentModule,
    SeedModule,
  ],
  controllers: [RentController],
  providers: [],
})
export class AppModule {}

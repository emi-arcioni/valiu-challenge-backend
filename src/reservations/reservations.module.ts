import { Module } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservation } from './entities/reservation.entity';
import { TablesService } from '../tables/tables.service';
import { Table } from '../tables/entities/table.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Reservation]),
    TypeOrmModule.forFeature([Table]),
  ],
  controllers: [ReservationsController],
  providers: [ReservationsService, TablesService],
  exports: [ReservationsService],
})
export class ReservationsModule {}

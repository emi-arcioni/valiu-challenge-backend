import { Injectable } from '@nestjs/common';
import * as dayjs from 'dayjs';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Reservation } from './entities/reservation.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { TablesService } from '../tables/tables.service';
import { Table } from '../tables/entities/table.entity';
import ReservationError from '../errors/reservation.error';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservation)
    private reservationsRepository: Repository<Reservation>,
    private tablesService: TablesService,
  ) {}

  async create(
    createReservationDto: CreateReservationDto,
  ): Promise<Reservation> {
    try {
      /**
       * Here's the strategy to assign a Table. Considerations:
       * - Check availability based on date
       * - Check availability based on customers
       * - First try to allocate customers in tables that customers = size
       * - Then try to allocate customers in tables that customers >= size * 0.5
       */

      // Get all tables without reservation for the date, and which size * 0.5 is <= customers
      // (potentially matching size for customers)

      // TODO: this logic could be traslated to the DB engine

      const tables = (
        await this.tablesService.findAll({
          storeId: createReservationDto.store.id,
        })
      ).filter((table) => {
        const reservationForDate = table.reservations.find((reservation) =>
          dayjs(reservation.date).isSame(
            dayjs(createReservationDto.date),
            'date',
          ),
        );
        return (
          !reservationForDate &&
          createReservationDto.customers >= table.size * 0.5 &&
          createReservationDto.customers <= table.size
        );
      });

      let remaining_space = Infinity;
      let selectedTable: Table;

      /**
       * A good improvement iteration for this logic would be trying to relocate inefficient reservations.
       * For instance: table 1 (size 4) has 2 customers, table 2 (size 2) has no customers.
       * A new reservation for 4 customers arrives, relocate the 2 customers of table 1 into table 2,
       * and reserve table 1 for the new 4 customers.
       */
      for (const table of tables) {
        if (table.size === createReservationDto.customers) {
          selectedTable = table;
          break;
        }

        const delta = table.size - createReservationDto.customers;
        if (delta < remaining_space) {
          selectedTable = table;
          remaining_space = delta;
        }
      }

      if (!selectedTable) {
        throw new ReservationError(
          `Not available tables for ${createReservationDto.customers} customers on date ${createReservationDto.date}`,
        );
      }

      return await this.reservationsRepository.save({
        ...createReservationDto,
        table: selectedTable,
      });
    } catch (err) {
      console.log(err.message);
      throw err;
    }
  }

  async findAll(): Promise<Reservation[]> {
    try {
      return await this.reservationsRepository.find({
        relations: ['table', 'table.store'],
        order: { id: 'ASC' },
      });
    } catch (err) {
      console.log(err.message);
      throw err;
    }
  }

  async findAllByStoreId(storeId: number): Promise<Reservation[]> {
    try {
      return await this.reservationsRepository.find({
        where: {
          table: {
            store: {
              id: storeId,
            },
          },
        },
        relations: ['table', 'table.store'],
        order: { id: 'ASC' },
      });
    } catch (err) {
      console.log(err.message);
      throw err;
    }
  }

  async findOne(id: number): Promise<Reservation> {
    try {
      return await this.reservationsRepository.findOne({
        where: { id },
        relations: ['table', 'table.store'],
      });
    } catch (err) {
      console.log(err.message);
      throw err;
    }
  }

  async update(
    id: number,
    updateReservationDto: UpdateReservationDto,
  ): Promise<UpdateResult> {
    try {
      const { date, customers } = updateReservationDto;
      return await this.reservationsRepository.update(id, {
        date,
        customers,
      });
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async remove(id: number): Promise<DeleteResult> {
    try {
      return await this.reservationsRepository.delete(id);
    } catch (err) {
      console.log(err.message);
      throw err;
    }
  }
}

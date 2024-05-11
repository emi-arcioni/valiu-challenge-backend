import { Injectable } from '@nestjs/common';
import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTableDto } from './dto/update-table.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Table } from './entities/table.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import ReservationsOnTableError from '../errors/reservations-on-table.error';

type Filters = {
  storeId?: number;
};
@Injectable()
export class TablesService {
  constructor(
    @InjectRepository(Table)
    private tablesRepository: Repository<Table>,
  ) {}

  async create(createTableDto: CreateTableDto): Promise<Table> {
    try {
      return await this.tablesRepository.save(createTableDto);
    } catch (err) {
      console.log(err.message);
      throw err;
    }
  }

  async findAll(filters: Filters = {}): Promise<Table[]> {
    const { storeId } = filters;
    let where;

    if (storeId)
      where = {
        store: {
          id: storeId,
        },
      };

    try {
      return await this.tablesRepository.find({
        relations: ['store', 'reservations'],
        order: { id: 'ASC' },
        where,
      });
    } catch (err) {
      console.log(err.message);
      throw err;
    }
  }

  async findOne(id: number): Promise<Table> {
    try {
      return await this.tablesRepository.findOne({
        where: { id },
        relations: ['store', 'reservations'],
      });
    } catch (err) {
      console.log(err.message);
      throw err;
    }
  }

  async update(
    id: number,
    updateTableDto: UpdateTableDto,
  ): Promise<UpdateResult> {
    try {
      const { size, store } = updateTableDto;
      return await this.tablesRepository.update(id, {
        size,
        store,
      });
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async remove(id: number): Promise<DeleteResult> {
    try {
      const store = await this.tablesRepository.findOne({
        where: { id },
        relations: ['reservations'],
      });
      /**
       * I check if the Table has any linked Reservations.
       * If so, I throw a custom exception
       */
      if (store?.reservations.length > 0)
        throw new ReservationsOnTableError(
          'Table has reservations associated, please delete them first',
        );

      return await this.tablesRepository.delete(id);
    } catch (err) {
      console.log(err.message);
      throw err;
    }
  }
}

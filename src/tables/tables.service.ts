import { Injectable } from '@nestjs/common';
import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTableDto } from './dto/update-table.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Table } from './entities/table.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';

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

  async findAll(): Promise<Table[]> {
    try {
      return await this.tablesRepository.find({
        relations: ['store'],
        order: { id: 'ASC' },
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
        relations: ['store'],
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
      const { capacity, store } = updateTableDto;
      return await this.tablesRepository.update(id, {
        capacity,
        store,
      });
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async remove(id: number): Promise<DeleteResult> {
    try {
      return await this.tablesRepository.delete(id);
    } catch (err) {
      console.log(err.message);
      throw err;
    }
  }
}

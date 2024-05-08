import { Injectable } from '@nestjs/common';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { Store } from './entities/store.entity';
import TablesOnStoreError from 'src/errors/tables-on-store.error';

@Injectable()
export class StoresService {
  constructor(
    @InjectRepository(Store)
    private storesRepository: Repository<Store>,
  ) {}

  async create(createStoreDto: CreateStoreDto): Promise<Store> {
    try {
      return await this.storesRepository.save(createStoreDto);
    } catch (err) {
      console.log(err.message);
      throw err;
    }
  }

  async findAll(): Promise<Store[]> {
    try {
      return await this.storesRepository.find({
        relations: ['tables'],
        order: { id: 'ASC' },
      });
    } catch (err) {
      console.log(err.message);
      throw err;
    }
  }

  async findOne(id: number): Promise<Store> {
    try {
      return await this.storesRepository.findOne({
        where: { id },
        relations: ['tables'],
      });
    } catch (err) {
      console.log(err.message);
      throw err;
    }
  }

  async update(
    id: number,
    updateStoreDto: UpdateStoreDto,
  ): Promise<UpdateResult> {
    try {
      return await this.storesRepository.update(id, {
        name: updateStoreDto.name,
      });
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async remove(id: number): Promise<DeleteResult> {
    try {
      const store = await this.storesRepository.findOne({
        where: { id },
        relations: ['tables'],
      });
      /**
       * I check if the Store has any linked Tables.
       * If so, I throw a custom exception
       */
      if (store?.tables.length > 0)
        throw new TablesOnStoreError(
          'Store has tables associated, please delete them first',
        );

      return await this.storesRepository.delete(id);
    } catch (err) {
      console.log(err.message);
      throw err;
    }
  }
}

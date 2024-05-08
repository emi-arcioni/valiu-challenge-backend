import { Injectable } from '@nestjs/common';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { Store } from './entities/store.entity';

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
      return await this.storesRepository.delete(id);
    } catch (err) {
      console.log(err.message);
      throw err;
    }
  }
}

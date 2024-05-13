import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpException,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { StoresService } from './stores.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import TablesOnStoreError from '../errors/tables-on-store.error';

@Controller('stores')
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @Post()
  @HttpCode(201)
  async create(@Body() createStoreDto: CreateStoreDto) {
    return await this.storesService.create(createStoreDto);
  }

  @Get()
  async findAll(@Query('page') page: number) {
    return await this.storesService.findAll(page);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const store = await this.storesService.findOne(id);
    if (!store)
      throw new HttpException("Store wasn't found", HttpStatus.NOT_FOUND);

    return store;
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateStoreDto: UpdateStoreDto,
  ) {
    const response = await this.storesService.update(id, updateStoreDto);

    /**
     * If response.affected === 0, I can assume that the Store that I'm willing to update doesn't exist
     */
    if (response.affected === 0)
      throw new HttpException("Store wasn't found", HttpStatus.NOT_FOUND);

    return await this.storesService.findOne(id);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    let response;
    try {
      response = await this.storesService.remove(id);
    } catch (err) {
      /**
       * This way I detect that the Store has linked Tables,
       * and if so, I throw an exception with the custom error message
       */
      if (err instanceof TablesOnStoreError)
        throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }

    /**
     * If response.affected === 0, I can assume that the Store that I'm willing to delete doesn't exist
     */
    if (response.affected === 0)
      throw new HttpException("Store wasn't found", HttpStatus.NOT_FOUND);

    return;
  }
}

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
} from '@nestjs/common';
import { TablesService } from './tables.service';
import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTableDto } from './dto/update-table.dto';

@Controller('tables')
export class TablesController {
  constructor(private readonly tablesService: TablesService) {}

  @Post()
  @HttpCode(201)
  async create(@Body() createTableDto: CreateTableDto) {
    return await this.tablesService.create(createTableDto);
  }

  @Get()
  async findAll() {
    return await this.tablesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const table = await this.tablesService.findOne(id);
    if (!table)
      throw new HttpException("Table wasn't found", HttpStatus.NOT_FOUND);

    return table;
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateTableDto: UpdateTableDto,
  ) {
    const response = await this.tablesService.update(id, updateTableDto);

    /**
     * If response.affected === 0, I can assume that the Table that I'm willing to update doesn't exist
     */
    if (response.affected === 0)
      throw new HttpException("Table wasn't found", HttpStatus.NOT_FOUND);

    return await this.tablesService.findOne(id);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    const response = await this.tablesService.remove(id);

    /**
     * If response.affected === 0, I can assume that the Table that I'm willing to delete doesn't exist
     */
    if (response.affected === 0)
      throw new HttpException("Table wasn't found", HttpStatus.NOT_FOUND);

    return;
  }
}

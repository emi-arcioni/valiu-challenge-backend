import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus,
  Post,
  HttpCode,
} from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import ReservationError from '../errors/reservation.error';
import { CreateReservationDto } from './dto/create-reservation.dto';

@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Post()
  @HttpCode(201)
  async createReservations(@Body() createReservationDto: CreateReservationDto) {
    try {
      await this.reservationsService.create(createReservationDto);
    } catch (err) {
      if (err instanceof ReservationError)
        throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  async findAll() {
    return await this.reservationsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const reservation = await this.reservationsService.findOne(id);
    if (!reservation)
      throw new HttpException("Reservation wasn't found", HttpStatus.NOT_FOUND);

    return reservation;
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateReservationDto: UpdateReservationDto,
  ) {
    const response = await this.reservationsService.update(
      id,
      updateReservationDto,
    );

    /**
     * If response.affected === 0, I can assume that the Reservation that I'm willing to update doesn't exist
     */
    if (response.affected === 0)
      throw new HttpException("Reservation wasn't found", HttpStatus.NOT_FOUND);

    return await this.reservationsService.findOne(id);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    const response = await this.reservationsService.remove(id);

    /**
     * If response.affected === 0, I can assume that the Reservation that I'm willing to delete doesn't exist
     */
    if (response.affected === 0)
      throw new HttpException("Reservation wasn't found", HttpStatus.NOT_FOUND);

    return;
  }
}

import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  Min,
  Validate,
} from 'class-validator';
import { StoreExists } from '../../validators/store-exists.validator';
import { Store } from '../../stores/entities/store.entity';

export class CreateReservationDto {
  @IsNotEmpty()
  @IsDateString()
  date: Date;

  @IsInt()
  @Min(1)
  customers: number;

  @IsNotEmpty()
  @Validate(StoreExists)
  store: Store;
}

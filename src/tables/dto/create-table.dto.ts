import { IsNotEmpty, Validate } from 'class-validator';
import { StoreExists } from '../../validators/store-exists.validator';
import { Store } from '../../stores/entities/store.entity';

export class CreateTableDto {
  @IsNotEmpty()
  size: number;

  @IsNotEmpty()
  @Validate(StoreExists)
  store: Store;
}

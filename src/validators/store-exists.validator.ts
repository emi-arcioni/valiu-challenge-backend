import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { StoresService } from '../stores/stores.service';
import { Store } from '../stores/entities/store.entity';

/**
 * The purpose of this validation is to ensure that the Store passed
 * as a body parameter during the creation of a Table exists in the DB.
 */
@ValidatorConstraint({ name: 'storeExists', async: true })
@Injectable()
export class StoreExists implements ValidatorConstraintInterface {
  constructor(private readonly storesService: StoresService) {}

  async validate(store: Store) {
    if (isNaN(store?.id)) return false;

    const storeDB = await this.storesService.findOne(store.id);
    return !!storeDB;
  }

  defaultMessage(args: ValidationArguments) {
    if (args.value?.id) return `store with id ${args.value.id} does not exist.`;

    return `store does not exist.`;
  }
}

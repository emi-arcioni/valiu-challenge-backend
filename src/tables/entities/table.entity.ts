import { Reservation } from '../../reservations/entities/reservation.entity';
import { Store } from '../../stores/entities/store.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Table {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  size: number;

  @ManyToOne(() => Store, (store) => store.tables)
  store: Store;

  @OneToMany(() => Reservation, (reservation) => reservation.table)
  reservations: Reservation[];
}

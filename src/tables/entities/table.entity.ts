import { Store } from '../../stores/entities/store.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Table {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  capacity: number;

  @ManyToOne(() => Store, (store) => store.tables)
  store: Store;
}

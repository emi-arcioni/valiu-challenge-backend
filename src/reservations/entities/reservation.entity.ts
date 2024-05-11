import { Transform } from 'class-transformer';
import { Table } from '../../tables/entities/table.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as dayjs from 'dayjs';

@Entity()
export class Reservation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Transform(({ value }) => dayjs(value).format('YYYY-MM-DD'))
  date: Date;

  @Column()
  customers: number;

  @ManyToOne(() => Table, (table) => table.reservations, { nullable: false })
  table: Table;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public created_at: Date;
}

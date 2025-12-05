import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('cinema')
export class Cinema {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  file_id: string;

  @Column()
  code: number;

  @Column()
  install_count: number;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;
}

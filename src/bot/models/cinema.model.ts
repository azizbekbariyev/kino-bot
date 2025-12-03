import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('cinema')
export class Cinema {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  file_id: string;

  @Column()
  code: string;
}

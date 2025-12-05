import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { JoinChannel } from './join_channel.model';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'bigint',
    unique: true,
  })
  telegram_id: string;

  @Column()
  name_surname: string;

  @Column({
    type: 'enum',
    enum: ['admin', 'user'],
  })
  role: string;

  @Column({ type: 'varchar', nullable: true })
  step_one: string | null;

  @Column({ type: 'varchar', nullable: true })
  step_two: string | null;

  @OneToMany(() => JoinChannel, (joinChannel) => joinChannel.user)
  join_channels: JoinChannel[];
}

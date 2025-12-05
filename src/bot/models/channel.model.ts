import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { JoinChannel } from './join_channel.model';

@Entity('channel')
export class Channel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  channel_name: string;

  @Column()
  channel_id: string;

  @Column({
    type: 'enum',
    enum: ['public', 'private'],
  })
  type: string;

  @OneToMany(() => JoinChannel, (joinChannel) => joinChannel.channel)
  join_channels: JoinChannel[];
}

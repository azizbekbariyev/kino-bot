import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { JoinChannel } from './join_channel.model';

@Entity('channel')
export class Channel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  channel_name: string;

  @Column({
    type: 'bigint',
  })
  channel_id: string;

  @OneToMany(() => JoinChannel, (joinChannel) => joinChannel.channel)
  join_channels: JoinChannel[];
}

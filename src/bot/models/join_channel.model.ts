import { Entity, ManyToOne, PrimaryGeneratedColumn, JoinColumn } from 'typeorm';
import { User } from './user.model';
import { Channel } from './channel.model';

@Entity('join_channel')
export class JoinChannel {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.join_channels)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Channel, (channel) => channel.join_channels)
  @JoinColumn({ name: 'channel_id' })
  channel: Channel;
}

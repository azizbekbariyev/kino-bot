import { On, Update } from 'nestjs-telegraf';
import { UserService } from './user.service';
import { Context } from 'telegraf';
import { Ctx } from 'nestjs-telegraf';
import { ContextUpdate } from 'src/types/context.type';
import { JoinChannel } from 'src/bot/models/join_channel.model';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/bot/models/user.model';
import { Channel } from 'src/bot/models/channel.model';

@Update()
export class UserUpdate {
  constructor(
    private readonly userService: UserService,
    @InjectRepository(JoinChannel)
    private readonly joinChannelRepository: Repository<JoinChannel>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Channel)
    private readonly channelRepository: Repository<Channel>,
  ) {}

  @On('chat_join_request')
  async join(@Ctx() ctx: Context) {
    const req = ctx.update as ContextUpdate;
    let [user, channel] = await Promise.all([
      this.userRepository.findOne({
        where: { telegram_id: ctx.message!.from.id.toString() },
      }),
      this.channelRepository.findOne({
        where: { channel_id: req.chat_join_request.chat.id.toString() },
      }),
    ]);

    if (!user) {
      user = await this.userRepository.save({
        telegram_id: ctx.message!.from.id.toString(),
        name_surname:
          `${ctx.message!.from.first_name ?? ''} ${ctx.message!.from.last_name ?? ''}`.trim(),
        role: 'user',
      });
    }

    if (!channel) {
      channel = await this.channelRepository.save({
        channel_id: req.chat_join_request.chat.id.toString(),
        channel_name: req.chat_join_request.chat.title,
      });
    }

    await this.joinChannelRepository.save({
      user: user,
      channel: channel,
    });
  }
}

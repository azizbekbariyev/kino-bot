import { Injectable } from '@nestjs/common';
import { Ctx } from 'nestjs-telegraf';
import { Channel } from 'src/bot/models/channel.model';
import { Context } from 'telegraf';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/bot/models/user.model';
import { JoinChannel } from 'src/bot/models/join_channel.model';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Channel)
    private readonly channelRepository: Repository<Channel>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(JoinChannel)
    private readonly joinChannelRepository: Repository<JoinChannel>,
  ) {}

  async start(@Ctx() ctx: Context) {
    const user = await this.userRepository.findOne({
      where: { telegram_id: ctx.from!.id.toString() },
    });

    if (!user) {
      await this.userRepository.save({
        telegram_id: ctx.from!.id.toString(),
        name_surname: ctx.from!.first_name + ' ' + ctx.from!.last_name,
        role: 'user',
      });
    }

    const channels = await this.channelRepository.find();

    const joinChannel = await this.joinChannelRepository.find({
      where: { user: { id: user?.id } },
    });

    const notFollowChannel = channels.filter((channel) => {
      return !joinChannel.find((join) => join.channel.id === channel.id);
    });

    await ctx.reply("Quyidagi kanallarga obuna bo'ling", {
      reply_markup: {
        inline_keyboard: [
          notFollowChannel.map((channel) => {
            return {
              text: channel.channel_name,
              url: `https://t.me/${channel.channel_id}`,
            };
          }),
        ],
      },
    });
  }

  async text(@Ctx() ctx: Context) {}
}

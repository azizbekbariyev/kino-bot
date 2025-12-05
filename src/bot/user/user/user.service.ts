import { Injectable } from '@nestjs/common';
import { Ctx, InjectBot } from 'nestjs-telegraf';
import { Channel } from 'src/bot/models/channel.model';
import { Context, Telegraf } from 'telegraf';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/bot/models/user.model';
import { JoinChannel } from 'src/bot/models/join_channel.model';
import { Cinema } from 'src/bot/models/cinema.model';
import { ContextUpdate } from 'src/types/context.type';
import { BOT_NAME } from 'src/app.constants';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Channel)
    private readonly channelRepository: Repository<Channel>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(JoinChannel)
    private readonly joinChannelRepository: Repository<JoinChannel>,
    @InjectRepository(Cinema)
    private readonly cinemaRepository: Repository<Cinema>,
    @InjectBot(BOT_NAME) private readonly bot: Telegraf,
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

    if (!channels.length) {
      await ctx.reply('Xush kelibsiz kino kodini kiriting');
      return;
    }

    const joinChannel = await this.joinChannelRepository.find({
      relations: ['channel', 'user'],
      where: { user: { id: user?.id } },
    });

    const notFollowChannel: Channel[] = [];

    for (const channel of channels) {
      if (channel.type === 'public') {
        try {
          const member = await this.bot.telegram.getChatMember(
            channel.channel_id,
            ctx.from!.id,
          );

          if (member.status === 'left') {
            notFollowChannel.push(channel);
          }
        } catch (error: any) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          throw new Error(error);
        }
      } else {
        const isJoined = joinChannel.find(
          (join) => join.channel.channel_id === channel.channel_name,
        );

        if (!isJoined) {
          notFollowChannel.push(channel);
        }
      }
    }

    if (!notFollowChannel.length) {
      await ctx.reply('Xush kelibsiz kino kodini kiriting');
      return;
    }
    const keyboard: {
      text: string;
      url: string;
    }[][] = [];
    console.log(notFollowChannel);

    for (let i = 0; i < notFollowChannel.length; i++) {
      keyboard.push([
        {
          text: `Kanal ${i + 1}`,
          url:
            notFollowChannel[i].type === 'public'
              ? `https://t.me/${notFollowChannel[i].channel_id.replace(/^@/, '')}` // ✅ faqat username
              : notFollowChannel[i].channel_id,
        },
      ]);
    }

    await ctx.reply("Quyidagi kanallarga obuna bo'ling", {
      reply_markup: {
        inline_keyboard: keyboard,
      },
    });
  }

  async join(@Ctx() ctx: Context) {
    const req = ctx.update as ContextUpdate;
    let [user, channel] = await Promise.all([
      this.userRepository.findOne({
        where: { telegram_id: ctx.from!.id.toString() },
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
        type: 'private',
      });
    }
    await this.joinChannelRepository.save({
      user: user,
      channel: channel,
    });
  }

  async top(@Ctx() ctx: Context) {
    const cinemas = await this.cinemaRepository.find({
      order: { install_count: 'DESC' },
      take: 10,
    });
    for (const cinema of cinemas) {
      await ctx.sendVideo(cinema.file_id, {
        caption: `Kino kodi: ${cinema.code}`,
      });
    }
  }
}

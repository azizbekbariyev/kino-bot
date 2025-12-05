import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Ctx } from 'nestjs-telegraf';
import { Channel } from 'src/bot/models/channel.model';
import { Cinema } from 'src/bot/models/cinema.model';
import { User } from 'src/bot/models/user.model';
import { Context } from 'telegraf';
import { Repository } from 'typeorm';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Channel)
    private readonly channelRepository: Repository<Channel>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Cinema)
    private readonly cinemaRepository: Repository<Cinema>,
  ) {}

  async start(@Ctx() ctx: Context) {
    await ctx.reply(
      "Quyidagilardan birini tanlang\n\nKanal qo'shish uchun /new_channel\nKanalni o'chirish uchun /delete_channel\nKino qo'shish uchun /new_cinema\nKino o'chirish uchun /delete_cinema",
    );
  }

  async text(@Ctx() ctx: Context) {
    if (!('text' in ctx.message!)) {
      throw new Error('text');
    }

    const user = await this.userRepository.findOne({
      where: { telegram_id: ctx.from!.id.toString() },
    });
    switch (user?.step_one) {
      case 'new_channel':
        if (ctx.message.text[0] === '@') {
          const chat = await ctx.telegram.getChat(ctx.message.text);
          await this.channelRepository.save({
            channel_id: ctx.message.text,
            channel_name: chat.id.toString(),
            type: 'public',
          });
        } else {
          const user = await this.userRepository.findOne({
            where: { telegram_id: ctx.from!.id.toString() },
          });
          if (user?.step_two) {
            await this.channelRepository.save({
              channel_id: ctx.message.text,
              channel_name: user.step_two,
              type: 'private',
            });
            await this.userRepository.update(
              { telegram_id: ctx.from!.id.toString() },
              { step_one: null, step_two: null },
            );
            await ctx.reply("Kanal muvaffaqiyatli qo'shildi");
            return;
          } else {
            if ('message' in ctx.update) {
              const msg = ctx.update.message as any;
              // console.log(ctx.update.message.forward_from_chat);
              await this.userRepository.update(
                { telegram_id: ctx.from!.id.toString() },
                { step_two: msg.forward_from_chat.id },
              );
              await ctx.reply(
                "Qo'shilishi kerak bo/lgan kanal linkini yuboring kanal linkini yuboring",
              );
              return;
            }
            await ctx.reply('Iltimos yuqoridagi qoidaga qarang');
          }
        }
        break;
      case 'new_admin': {
        const text = ctx.message.text;
        if (text && /^\+?\d{9,15}$/.test(text)) {
          const user = await this.userRepository.findOne({
            where: { telegram_id: text },
          });

          if (!user) {
            await this.userRepository.save({
              telegram_id: text,
              name_surname: 'Admin',
              role: 'admin',
            });
          }

          await this.userRepository.update(
            { telegram_id: text },
            { role: 'admin' },
          );

          await ctx.reply("Admin muvaffaqiyatli qo'shildi");
        } else {
          console.log('Forward orqali ID:', ctx.message);
        }

        break;
      }

      case 'new_cinema':
        if (!/^\d+$/.test(ctx.message.text)) {
          await ctx.reply('Kino kodini nomer bilan yuboring');
          return;
        }
        await this.userRepository.update(
          { telegram_id: ctx.from!.id.toString() },
          { step_two: ctx.message.text },
        );

        await ctx.reply('Videoni yuboring');
        break;
    }
  }

  async newAdmin(@Ctx() ctx: Context) {
    const user = await this.userRepository.findOne({
      where: { telegram_id: ctx.from!.id.toString() },
    });

    await this.userRepository.save({
      ...user,
      step: 'new_admin',
    });

    await ctx.reply(
      "Admin kiritmoqchi bo'lgan admingizni telegram_idsi, usernameini yoki undan habar yuboring",
    );
  }

  async onVideo(@Ctx() ctx: Context) {
    const user = await this.userRepository.findOne({
      where: { telegram_id: ctx.from!.id.toString() },
    });

    if (user?.step_one != 'new_cinema' && !user?.step_two) {
      await ctx.reply('Iltimos /help dan foydalaning');
      return;
    }

    if (!('video' in ctx.message!)) {
      throw new Error('video');
    }

    await this.cinemaRepository.save({
      file_id: ctx.message.video.file_id,
      code: Number(user.step_two),
      install_count: 0,
    });

    await this.userRepository.update(
      { telegram_id: ctx.from!.id.toString() },
      { step_one: null, step_two: null },
    );

    await ctx.reply("Kino muvaffaqiyatli qo'shildi");
  }
}

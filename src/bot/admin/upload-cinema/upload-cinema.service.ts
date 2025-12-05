import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Ctx } from 'nestjs-telegraf';
import { Cinema } from 'src/bot/models/cinema.model';
import { User } from 'src/bot/models/user.model';
import { Context } from 'telegraf';
import { Repository } from 'typeorm';

@Injectable()
export class UploadCinemaService {
  constructor(
    @InjectRepository(Cinema)
    private readonly cinemaRepository: Repository<Cinema>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async last(@Ctx() ctx: Context) {
    const lastCinema = await this.cinemaRepository.find({
      order: { created_at: 'DESC' },
      take: 10,
    });

    for (const cinema of lastCinema) {
      await ctx.sendVideo(cinema.file_id, {
        caption: `Kino kodi: ${cinema.code}`,
      });
    }

    await ctx.reply('Oxirgi top 10 kinolarni yubordim');
  }

  async rand(@Ctx() ctx: Context) {
    const cinemas = await this.cinemaRepository.find();
    const rand = Math.floor(Math.random() * cinemas.length);
    const cinema = cinemas[rand];
    await ctx.sendVideo(cinema.file_id, {
      caption: `Kino kodi: ${cinema.code}`,
    });
  }

  async statisticCinema(@Ctx() ctx: Context) {
    const cinemas = await this.cinemaRepository.find({
      order: { install_count: 'DESC' },
      take: 10,
    });

    let message = 'Kino statistikasi: \n\n';

    cinemas.forEach((cinema) => {
      message += `Kino ko'rilgan: ${cinema.install_count} \nKino kodi: ${cinema.code}\n\n`;
    });

    await ctx.reply(message);
  }

  async newCinema(@Ctx() ctx: Context) {
    await this.userRepository.update(
      { telegram_id: ctx.from!.id.toString() },
      { step_one: 'new_cinema' },
    );
    await ctx.reply("Qo'shayotgan kinoni kodini yuboring");
  }
}

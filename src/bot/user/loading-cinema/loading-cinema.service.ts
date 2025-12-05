import { Injectable } from '@nestjs/common';
import { Ctx } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cinema } from 'src/bot/models/cinema.model';

@Injectable()
export class LoadingCinemaService {
  constructor(
    @InjectRepository(Cinema)
    private readonly cinemaRepository: Repository<Cinema>,
  ) {}
  async text(@Ctx() ctx: Context) {
    if (!('text' in ctx.message!)) {
      throw new Error('text');
    }
    if (!/^\d+$/.test(ctx.message.text)) {
      await ctx.reply('Kino kodini nomer bilan yuboring');
      return;
    }
    const cinema = await this.cinemaRepository.findOne({
      where: { code: Number(ctx.message.text) },
    });

    if (!cinema || !cinema.file_id) {
      await ctx.reply('Bunday kod bilan video topilmadi');
      return;
    }

    await this.cinemaRepository.save({
      ...cinema,
      install_count: cinema.install_count + 1,
    });

    await ctx.sendVideo(cinema.file_id);
  }
}

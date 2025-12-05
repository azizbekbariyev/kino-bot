import { Injectable } from '@nestjs/common';
import { Ctx } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { User } from './models/user.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from './user/user/user.service';
import { AdminService } from './admin/admin/admin.service';
import { LoadingCinemaService } from './user/loading-cinema/loading-cinema.service';

@Injectable()
export class BotService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly userService: UserService,
    private readonly adminService: AdminService,
    private readonly loadingCinemaService: LoadingCinemaService,
  ) {}

  async start(@Ctx() ctx: Context) {
    const userId = ctx.from!.id.toString();

    const user = await this.userRepository.findOne({
      where: { telegram_id: userId },
    });

    if (user && user.role === 'admin') {
      await this.adminService.start(ctx);
    } else if (user && user.role === 'user') {
      await this.userService.start(ctx);
    } else {
      await this.userRepository.save({
        telegram_id: userId,
        name_surname: ctx.from!.first_name + ' ' + ctx.from!.last_name,
        role: 'user',
      });
      await this.userService.start(ctx);
    }
  }

  async newChannel(@Ctx() ctx: Context) {
    const user = await this.userRepository.findOne({
      where: { telegram_id: ctx.from!.id.toString() },
    });

    await this.userRepository.save({
      ...user,
      step: 'new_channel',
    });

    await this.userRepository.update(
      { telegram_id: ctx.from!.id.toString() },
      { step_one: 'new_channel' },
    );

    await ctx.reply(
      "Kanalingiz yopiq bo'lsa post tashlang, agar ochiq bo'lsa @ bilan yuboring.",
    );
  }

  async text(@Ctx() ctx: Context) {
    const user = await this.userRepository.findOne({
      where: { telegram_id: ctx.from!.id.toString() },
    });

    if (user?.role == 'admin') {
      await this.adminService.text(ctx);
    } else {
      await this.loadingCinemaService.text(ctx);
    }
  }
}

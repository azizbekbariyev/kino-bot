import { Command, Ctx, Update } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { UploadCinemaService } from './upload-cinema.service';

@Update()
export class UploadCinemaUpdate {
  constructor(private readonly uploadingCinemaService: UploadCinemaService) {}

  @Command('last')
  async last(@Ctx() ctx: Context) {
    await this.uploadingCinemaService.last(ctx);
  }

  @Command('rand')
  async rand(@Ctx() ctx: Context) {
    await this.uploadingCinemaService.rand(ctx);
  }

  @Command('statistic_cinema')
  async statisticCinema(@Ctx() ctx: Context) {
    await this.uploadingCinemaService.statisticCinema(ctx);
  }

  @Command('new_cinema')
  async newCinema(@Ctx() ctx: Context) {
    await this.uploadingCinemaService.newCinema(ctx);
  }
}

import { Command, Ctx, On, Start, Update } from 'nestjs-telegraf';
import { BotService } from './bot.service';
import { Context } from 'telegraf';

@Update()
export class BotUpdate {
  constructor(private readonly botService: BotService) {}
  @Start()
  async start(@Ctx() ctx: Context) {
    await this.botService.start(ctx);
  }

  @On('video')
  onVideo(@Ctx() ctx: Context) {
    this.botService.onVideo(ctx);
  }

  @Command('new_channel')
  async newChannel(@Ctx() ctx: Context) {
    await this.botService.newChannel(ctx);
  }

  @On('text')
  async text(@Ctx() ctx: Context) {
    await this.botService.text(ctx);
  }
}

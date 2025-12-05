import { Command, On, Update } from 'nestjs-telegraf';
import { UserService } from './user.service';
import { Context } from 'telegraf';
import { Ctx } from 'nestjs-telegraf';

@Update()
export class UserUpdate {
  constructor(private readonly userService: UserService) {}

  @On('chat_join_request')
  async join(@Ctx() ctx: Context) {
    await this.userService.join(ctx);
  }

  @Command('top')
  async top(@Ctx() ctx: Context) {
    await this.userService.top(ctx);
  }
}

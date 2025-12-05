import { Command, Ctx, On, Update } from 'nestjs-telegraf';
import { AdminService } from './admin.service';
import { Context } from 'telegraf';

@Update()
export class AdminUpdate {
  constructor(private readonly adminService: AdminService) {}

  @Command('new_admin')
  async newAdmin(@Ctx() ctx: Context) {
    await this.adminService.newAdmin(ctx);
  }

  @On('video')
  async onVideo(@Ctx() ctx: Context) {
    await this.adminService.onVideo(ctx);
  }
}

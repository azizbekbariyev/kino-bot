import { Injectable } from '@nestjs/common';
import { Ctx } from 'nestjs-telegraf';
import { Context } from 'telegraf';

@Injectable()
export class AdminService {
  constructor() {}

  async start(@Ctx() ctx: Context) {}

  async text(@Ctx() ctx: Context) {
    if (ctx.message!.text[1] == '@') {
    }
  }
}

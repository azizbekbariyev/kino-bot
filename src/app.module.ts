import { Module } from '@nestjs/common';
import { BotModule } from './bot/bot.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { TelegrafModule } from 'nestjs-telegraf';
import { session } from 'telegraf';
import { BOT_NAME } from './app.constants';
import { JoinChannel } from './bot/models/join_channel.model';
import { Channel } from './bot/models/channel.model';
import { User } from './bot/models/user.model';
import { Cinema } from './bot/models/cinema.model';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),

    TelegrafModule.forRootAsync({
      botName: BOT_NAME,
      useFactory: () => ({
        token: process.env.BOT_TOKEN!,
        middlewares: [session()],
        include: [BotModule],
      }),
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.PG_HOST,
      port: Number(process.env.PG_PORT),
      username: process.env.PG_USER,
      password: process.env.PG_PASSWORD,
      database: process.env.PG_DB,
      entities: [JoinChannel, Channel, User, Cinema],
      synchronize: true,
      autoLoadEntities: true,
      dropSchema: false,
    }),

    BotModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

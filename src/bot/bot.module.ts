import { Module } from '@nestjs/common';
import { BotUpdate } from './bot.update';
import { BotService } from './bot.service';
import { User } from './models/user.model';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminService } from './admin/admin/admin.service';
import { AdminUpdate } from './admin/admin/admin.update';
import { UserService } from './user/user/user.service';
import { UserUpdate } from './user/user/user.update';
import { UploadCinemaService } from './admin/upload-cinema/upload-cinema.service';
import { UploadCinemaUpdate } from './admin/upload-cinema/upload-cinema.update';
import { LoadingCinemaService } from './user/loading-cinema/loading-cinema.service';
import { LoadingCinemaUpdate } from './user/loading-cinema/loading-cinema.update';
import { Channel } from './models/channel.model';
import { JoinChannel } from './models/join_channel.model';
import { Cinema } from './models/cinema.model';

@Module({
  imports: [TypeOrmModule.forFeature([User, Channel, JoinChannel, Cinema])],
  controllers: [],
  providers: [
    BotService,
    AdminService,
    UserService,
    UploadCinemaService,
    LoadingCinemaService,
    LoadingCinemaUpdate,
    UploadCinemaUpdate,
    UserUpdate,
    AdminUpdate,
    BotUpdate,
  ],
  exports: [],
})
export class BotModule {}

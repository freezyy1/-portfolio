import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { AppController } from './app.controller';
import { CatModule } from './cat/cat.module';
import { GameModule } from './game/game.module';
import { LeaderboardModule } from './leaderboard/leaderboard.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    HttpModule.register({ timeout: 8000 }),
    CatModule,
    GameModule,
    LeaderboardModule,
    AdminModule,
  ],
  controllers: [AppController],
})
export class AppModule {}

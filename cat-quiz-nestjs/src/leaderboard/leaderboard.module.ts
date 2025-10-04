import { Module } from '@nestjs/common';
import { LeaderboardController } from './leaderboard.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [LeaderboardController],
  providers: [PrismaService],
})
export class LeaderboardModule {}

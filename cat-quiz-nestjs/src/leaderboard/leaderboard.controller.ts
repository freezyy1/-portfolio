import { Body, Controller, Get, Post } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('leaderboard')
export class LeaderboardController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async getTop() {
    return this.prisma.score.findMany({
      orderBy: [{ score: 'desc' }, { createdAt: 'asc' }],
      take: 10,
      select: { id: true, name: true, score: true, difficulty: true, totalRounds: true, createdAt: true },
    });
  }

  @Post()
  async submit(@Body() body: { name: string; score: number; difficulty: string; totalRounds: number }) {
    const name = (body?.name || 'Anon').toString().slice(0, 20);
    const score = Math.max(0, Math.min(1000, Number(body?.score || 0)));
    const difficulty = ['easy','medium','hard'].includes((body?.difficulty||'').toLowerCase())
      ? (body.difficulty as string).toLowerCase() : 'medium';
    const totalRounds = Math.max(1, Math.min(50, Number(body?.totalRounds || 10)));

    await this.prisma.score.create({
      data: { name, score, difficulty, totalRounds }
    });
    return { ok: true };
  }
}

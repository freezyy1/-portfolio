import { Controller, Get, Query, Res, Post, Body, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { Response } from 'express';

@Controller('admin')
export class AdminController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  async getAdminLogin(@Res() res: Response) {
    res.render('admin-login');
  }

  @Post('login')
  async login(@Body() body: { password: string }, @Res() res: Response) {
    const adminPassword = this.configService.get<string>('ADMIN_PASSWORD');
    
    if (!body.password || body.password !== adminPassword) {
      return res.status(401).render('admin-login', { error: 'Неверный пароль' });
    }

    // простая система сессий - в продакшне использовать полноценное управление
    res.cookie('admin_auth', 'authenticated', { httpOnly: true, maxAge: 3600000 });
    res.redirect('/admin/dashboard');
  }

  @Get('dashboard')
  async getAdmin(@Query('difficulty') difficulty: string, @Res() res: Response) {
    const authCookie = res.req.cookies?.admin_auth;
    if (authCookie !== 'authenticated') {
      return res.redirect('/admin');
    }

    const where: any = {};
    if (difficulty && ['easy','medium','hard'].includes(difficulty.toLowerCase())) {
      where.difficulty = difficulty.toLowerCase();
    }
    const scores = await this.prisma.score.findMany({
      where,
      orderBy: [{ score: 'desc' }, { createdAt: 'asc' }],
      take: 100,
    });
    res.render('admin', { scores, difficulty });
  }

  @Post('logout')
  async logout(@Res() res: Response) {
    res.clearCookie('admin_auth');
    res.redirect('/admin');
  }
}

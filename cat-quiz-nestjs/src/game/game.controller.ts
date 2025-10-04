import { Controller, Get, Query } from '@nestjs/common';
import { GameService } from './game.service';

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Get('question')
  async getQuestion(@Query('difficulty') difficulty: 'easy'|'medium'|'hard' = 'medium') {
    return this.gameService.getQuestion(difficulty);
  }
}

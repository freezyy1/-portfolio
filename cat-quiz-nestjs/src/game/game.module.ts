import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { CatModule } from '../cat/cat.module';

@Module({
  imports: [CatModule],
  providers: [GameService],
  controllers: [GameController],
})
export class GameModule {}

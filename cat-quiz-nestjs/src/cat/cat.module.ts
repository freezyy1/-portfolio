import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CatService } from './cat.service';

@Module({
  imports: [HttpModule],
  providers: [CatService],
  exports: [CatService],
})
export class CatModule {}

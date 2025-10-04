import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller()
export class AppController {
  @Get()
  home(@Res() res: Response) {
    res.render('index', { title: 'Угадай породу кота' });
  }
}

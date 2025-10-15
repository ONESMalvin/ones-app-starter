import { Controller, Get, Post, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { join } from 'path';
import { readFileSync } from 'fs';
import type { Response } from 'express';
import { HttpException, HttpStatus } from '@nestjs/common';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getManifest(@Res() res: Response) {
    try {
      const manifestPath = join(process.cwd(), 'manifest.json');
      const manifestData = readFileSync(manifestPath, 'utf8');
      res.setHeader('Content-Type', 'application/json');
      res.send(manifestData);
    } catch {
      throw new HttpException(
        'Failed to read manifest file',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('install_cb')
  installCallback(@Res() res: Response) {
    res.status(HttpStatus.OK).send('Install accepted');
  }
}

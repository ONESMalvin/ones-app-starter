import { Controller, Get, Post, Res, Body } from '@nestjs/common';
import { join } from 'path';
import { readFileSync } from 'fs';
import type { Response } from 'express';
import { HttpException, HttpStatus, Logger } from '@nestjs/common';
import { DatabaseService } from './services/database.service';
import { OpenApiService } from './services/openapi.service';
import {
  InstallCallbackReq,
  InstallCallbackResp,
  LifecycleCallbackReq,
  SettingPageEntryRequest,
  SettingPageEntriesResponse,
} from './dto/install-callback.dto';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(
    private readonly databaseService: DatabaseService,
    private readonly openapiService: OpenApiService,
  ) {}

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
  async installCallback(
    @Body() requestBody: InstallCallbackReq,
    @Res() res: Response,
  ) {
    this.logger.log(
      `receive install callback installation id: ${requestBody.installation_id}`,
    );

    try {
      await this.databaseService.saveInstallCallback(requestBody);
      this.logger.log(
        `save install callback info success: ${requestBody.installation_id}`,
      );

      const response: InstallCallbackResp = {
        installation_id: requestBody.installation_id,
        time_stamp: Math.floor(Date.now() / 1000),
      };

      this.logger.log(
        `send install callback response: ${JSON.stringify(response)}`,
      );
      res.status(HttpStatus.OK).send(response);
    } catch (error) {
      this.logger.error(
        `install callback failed: ${error instanceof Error ? error.message : 'unknown error'}`,
      );
      throw new HttpException(
        `save install callback info failed: ${error instanceof Error ? error.message : 'unknown error'}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('/enabled_cb')
  async handleEnabledCB(
    @Body() requestBody: LifecycleCallbackReq,
    @Res() res: Response,
  ) {
    const installationID = requestBody.installation_id;
    const installInfo =
      await this.databaseService.getInstallation(installationID);

    this.logger.log(
      `receive enabled callback installation id: ${requestBody.installation_id}`,
    );

    try {
      const body = await this.openapiService.callONESOpenAPI(
        installInfo,
        '',
        '/openapi/v2/account/teams',
        'GET',
        null,
      );
      this.logger.log(`organization enabled, teams: ${JSON.stringify(body)}`);
    } catch (error) {
      throw new HttpException(
        `enabled callback failed: ${error instanceof Error ? error.message : 'unknown error'}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    res.status(HttpStatus.OK).send({ status: 'success', message: 'ok' });
  }

  @Post('/settingPage/entries')
  handleSettingPageEntries(@Body() requestBody: SettingPageEntryRequest) {
    console.log('handle /settingPage/entries, header:', requestBody);

    const returnEntries: SettingPageEntriesResponse = {
      entries: [
        {
          title: requestBody.language === 'zh' ? '示例页面' : 'Example page',
          page_url: '/static/example-page.html',
        },
      ],
    };

    return returnEntries;
  }
}

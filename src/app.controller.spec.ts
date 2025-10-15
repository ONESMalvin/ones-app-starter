import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import * as fs from 'fs';
import type { Response } from 'express';

describe('AppController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();
  });

  describe('getManifest', () => {
    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should send manifest.json content with correct headers', () => {
      const appController = app.get(AppController);

      const mockContent = '{"name":"test-app"}';
      jest.spyOn(fs, 'readFileSync').mockReturnValue(mockContent);

      const setHeader = jest.fn();
      const send = jest.fn();
      const res = { setHeader, send } as unknown as Response;

      appController.getManifest(res);

      expect(setHeader).toHaveBeenCalledWith(
        'Content-Type',
        'application/json',
      );
      expect(send).toHaveBeenCalledWith(mockContent);
    });

    it('should throw HttpException when reading manifest fails', () => {
      const appController = app.get(AppController);
      jest.spyOn(fs, 'readFileSync').mockImplementation(() => {
        throw new Error('read error');
      });

      const res = {
        setHeader: jest.fn(),
        send: jest.fn(),
      } as unknown as Response;

      expect(() => appController.getManifest(res)).toThrowError();
    });
  });
});

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { Response } from 'express';
import { InstallCallback } from './entities/install-callback.entity';
import { DatabaseService } from './services/database.service';
import { OpenApiService } from './services/openapi.service';
import { AuthService } from './services/auth.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: './appv2.db',
      entities: [InstallCallback],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([InstallCallback]),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'web', 'dist'),
      serveRoot: '/static',
      serveStaticOptions: {
        index: false,
        setHeaders: (res: Response) => {
          // Set CORS headers
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader(
            'Access-Control-Allow-Methods',
            'GET, POST, PUT, DELETE, OPTIONS',
          );
          res.setHeader(
            'Access-Control-Allow-Headers',
            'Content-Type, Authorization, X-Requested-With',
          );
          res.setHeader('Access-Control-Allow-Credentials', 'true');
        },
      },
    }),
  ],
  controllers: [AppController],
  providers: [DatabaseService, OpenApiService, AuthService],
})
export class AppModule {}

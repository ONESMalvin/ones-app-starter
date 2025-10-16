import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { InstallCallback } from './entities/install-callback.entity';
import { DatabaseService } from './services/database.service';
import { OpenApiService } from './services/openapi.service';
import { AuthService } from './services/auth.service';

@Module({
  imports: [
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
      },
    }),
  ],
  controllers: [AppController],
  providers: [DatabaseService, OpenApiService, AuthService],
})
export class AppModule {}

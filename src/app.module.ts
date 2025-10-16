import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
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
  ],
  controllers: [AppController],
  providers: [DatabaseService, OpenApiService, AuthService],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BookModule } from './book/book.module';
import { ReviewModule } from './review/review.module';
import { AuthorModule } from './author/author.module';
import { GenreModule } from './genre/genre.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from 'typeorm.config';
import { ReaderModule } from './reader/reader.module';
import { ModeratorModule } from './moderator/moderator.module';
import { APP_GUARD } from '@nestjs/core';
import { AtGuard, RolesGuard } from './custom/guards';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [BookModule, ReviewModule, AuthorModule, GenreModule, TypeOrmModule.forRoot(typeOrmConfig), ReaderModule, ModeratorModule],
  controllers: [AppController],
  providers: [AppService,
    {
      provide: APP_GUARD,
      useClass: AtGuard
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard
    }
  ]
})
export class AppModule { }

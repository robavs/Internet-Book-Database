import { Module } from '@nestjs/common';
import { GenreService } from './genre.service';
import { GenreController } from './genre.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Genre } from 'src/entities/genre.entity';
import { Book } from 'src/entities/book.entity';
import { Author } from 'src/entities/author.entity';
import { BookModule } from 'src/book/book.module';

@Module({
  imports: [BookModule, TypeOrmModule.forFeature([Genre, Author, Book])],
  providers: [GenreService],
  controllers: [GenreController]
})
export class GenreModule { }

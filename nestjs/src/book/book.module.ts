import { Module } from '@nestjs/common';
import { BookService } from './book.service';
import { BookController } from './book.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from 'src/entities/book.entity';
import { Author } from 'src/entities/author.entity';
import { AuthorModule } from 'src/author/author.module';
import { Genre } from 'src/entities/genre.entity';
import { Review } from 'src/entities/review.entity';
import { Reader } from 'src/entities/reader.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Book, Author, Genre, Review, Reader])],
  providers: [BookService],
  controllers: [BookController],
  exports: [BookService]
})
export class BookModule { }

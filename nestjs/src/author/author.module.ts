import { Module } from '@nestjs/common';
import { AuthorService } from './author.service';
import { AuthorController } from './author.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Author } from 'src/entities/author.entity';
import { BookModule } from 'src/book/book.module';
import { Book } from 'src/entities/book.entity';
import { Genre } from 'src/entities/genre.entity';
import { Review } from 'src/entities/review.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Author, Book, Genre, Review])],
  providers: [AuthorService],
  controllers: [AuthorController],
  exports: [AuthorService]
})
export class AuthorModule { }

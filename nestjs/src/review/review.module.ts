import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from 'src/entities/review.entity';
import { Book } from 'src/entities/book.entity';
import { Reader } from 'src/entities/reader.entity';
import { Author } from 'src/entities/author.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Review, Book, Reader, Author])],
  providers: [ReviewService],
  controllers: [ReviewController],
  exports: [ReviewService]
})
export class ReviewModule { }

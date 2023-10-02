import { Module } from '@nestjs/common';
import { ReaderService } from './reader.service';
import { ReaderController } from './reader.controller';
import { TypeOrmModule } from '@nestjs/typeorm'
import { Reader } from 'src/entities/reader.entity';
import { User } from 'src/entities/user.entity';
import { ReviewModule } from 'src/review/review.module';
import { Book } from 'src/entities/book.entity';
import { Author } from 'src/entities/author.entity';
import { Review } from 'src/entities/review.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule, ReviewModule, TypeOrmModule.forFeature([Reader, User, Book, Author, Review])],
  providers: [ReaderService],
  controllers: [ReaderController]
})
export class ReaderModule { }

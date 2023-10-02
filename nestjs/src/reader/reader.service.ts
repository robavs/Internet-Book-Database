import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { Author } from 'src/entities/author.entity';
import { Book } from 'src/entities/book.entity';
import { Reader } from 'src/entities/reader.entity';
import { Review } from 'src/entities/review.entity';
import { ReviewService } from 'src/review/review.service';
import { Repository } from 'typeorm';

@Injectable()
export class ReaderService extends AuthService<Reader>{
    constructor(
        @InjectRepository(Reader) private readonly readerRepository: Repository<Reader>,
        @InjectRepository(Review) private readonly reviewRepository: Repository<Review>,
        @InjectRepository(Author) private readonly authorRepository: Repository<Author>,
        @InjectRepository(Book) private readonly bookRepository: Repository<Book>
    ) {
        super(readerRepository);
    }

    async delete(readerId: number): Promise<void> {
        try {
            const reader: Reader = await this.readerRepository.findOne({
                where: {
                    id: readerId
                }
            })

            if (!reader) throw new NotFoundException("Reader not found")

            const reviews: Review[] = await this.reviewRepository.find({
                where: {
                    readerId
                },
                relations: {
                    book: {
                        authors: true
                    }
                }
            })

            await this.reviewRepository.delete({
                reader: {
                    id: readerId
                }
            })

            await this.readerRepository.delete(readerId)
            for (const review of reviews) {
                const book: Book = review.book

                // netso zeza da se updetjuje ocena za autora, obrise bukv samo za jednu
                // for (const author of book.authors) {
                //     author.rating = (author.rating * author.numberOfReviews - review.rating) / (author.numberOfReviews - 1)
                //     author.numberOfReviews -= 1
                //     await this.authorRepository.save(author)
                // }

                book.rating = (book.rating * book.numberOfReviews - review.rating) / (--book.numberOfReviews)
                await this.bookRepository.save(book)
            }
        }
        catch (err) {
            console.log(err)
        }
    }
}

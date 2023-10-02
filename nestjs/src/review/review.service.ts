import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from 'src/entities/book.entity';
import { Review } from 'src/entities/review.entity';
import { FindOperator, FindOperators, FindOptions, FindOptionsWhere, MoreThan, Repository } from 'typeorm';
import { CreateReviewDto, UpdateReviewDto } from './dto';
import { Reader } from 'src/entities/reader.entity';
import { Author } from 'src/entities/author.entity';

@Injectable()
export class ReviewService {
    constructor(
        @InjectRepository(Review) private readonly reviewRepository: Repository<Review>,
        @InjectRepository(Book) private readonly bookRepository: Repository<Book>,
        @InjectRepository(Reader) private readonly readerRepository: Repository<Reader>,
        @InjectRepository(Author) private readonly authorRepository: Repository<Author>
    ) { }

    async getReadersReviews(readerId: number): Promise<Reader> {
        try {
            const reader: Reader = await this.readerRepository.findOne({
                where: {
                    id: readerId
                },
                relations: {
                    reviews: {
                        book: {
                            authors: true
                        }
                    }
                },
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    reviews: {
                        bookId: true,
                        rating: true,
                        comment: true,
                        updatedAt: true,
                        book: {
                            id: true,
                            name: true,
                            rating: true,
                            numberOfReviews: true,
                            authors: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                rating: true,
                            }
                        }
                    }
                }
            })
            return reader
        }
        catch (err) {
            console.log(err)
        }
    }

    async create(readerId: number, bookId: number, { rating, comment }: CreateReviewDto): Promise<CreateReviewDto> {
        try {
            if (rating < 1 || rating > 10) throw new Error("Rating must be between 1 and 10")
            const review: Review = await this.reviewRepository.findOne({
                where: {
                    readerId,
                    bookId
                },
            })
            if (review) throw new Error("User already submitted review for this book")

            const reader = await this.readerRepository.findOne({
                where: {
                    id: readerId
                },
                select: {
                    id: true,
                    firstName: true,
                    lastName: true
                }
            })
            if (!reader) throw new NotFoundException("Reader doesnt exist")

            const book: Book = await this.bookRepository.findOne({
                where: {
                    id: bookId
                },
                relations: {
                    authors: true
                }
            })
            if (!book) throw new NotFoundException("Book doesn't exist")

            // ovde treba da uradim da mi ne vraca bukvalno sve propertije
            // nego samo ono obicno, mozda cak nista ni da ne vraca, to cu posle

            const newReview = new Review()
            newReview.rating = rating
            newReview.comment = comment
            newReview.reader = reader
            newReview.book = book

            const authors: Author[] = book.authors
            // updejtujemo ocenu autora
            for (const author of authors) {
                author.rating = (author.rating * author.numberOfReviews + rating) / (++author.numberOfReviews)
                await this.authorRepository.save(author)
            }

            book.rating = (book.rating * book.numberOfReviews + rating) / (++book.numberOfReviews)
            await this.bookRepository.save(book)
            await this.reviewRepository.save(newReview)
            return { rating, comment }
        }
        catch (err) {
            console.log(err)
        }
    }

    async update(readerId: number, bookId: number, reviewProps: UpdateReviewDto): Promise<Review> {
        try {
            let review: Review = await this.reviewRepository.findOne({
                where: {
                    readerId,
                    bookId
                },
                relations: {
                    book: {
                        authors: true
                    }
                }
            })
            if (!review) throw new Error("Review doesn't exist")
            // azuriramo rating i za knjigu i za autore
            if (reviewProps.rating && reviewProps.rating !== review.rating) {
                const book: Book = await this.bookRepository.findOne({
                    where:
                    {
                        id: bookId
                    }
                })
                book.rating = (book.rating * book.numberOfReviews - review.rating + reviewProps.rating) / book.numberOfReviews
                await this.bookRepository.save(book)
                for (const author of review.book.authors) {
                    author.rating = (author.rating * author.numberOfReviews - review.rating + reviewProps.rating) / author.numberOfReviews
                    await this.authorRepository.save(author)
                }
            }
            review = {
                ...review,
                ...reviewProps,
                updatedAt: new Date()
            }
            return await this.reviewRepository.save(review)
        }
        catch (err) {
            console.log(err)
        }
    }
}

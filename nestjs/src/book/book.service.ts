import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from 'src/entities/book.entity';
import { In, Not, Repository } from 'typeorm';
import { CreateBookDto, UpdateBookDto } from './dto';
import { Author } from 'src/entities/author.entity';
import { Genre } from 'src/entities/genre.entity';
import { Review } from 'src/entities/review.entity';
import { Reader } from 'src/entities/reader.entity';

@Injectable()
export class BookService {
    constructor(
        @InjectRepository(Book) private readonly bookRepository: Repository<Book>,
        @InjectRepository(Author) private readonly authorRepository: Repository<Author>,
        @InjectRepository(Genre) private readonly genreRepository: Repository<Genre>,
        @InjectRepository(Review) private readonly reviewRepository: Repository<Review>,
        @InjectRepository(Reader) private readonly readerRepository: Repository<Reader>
    ) { }

    async get(id: number): Promise<Book> {
        try {
            const book = await this.bookRepository.findOne({
                where: {
                    id
                },
                relations: {
                    authors: true,
                    genres: true,
                    reviews: {
                        reader: true
                    }
                },
                select: {
                    id: true,
                    name: true,
                    publicationDate: true,
                    numberOfPages: true,
                    rating: true,
                    image: true,
                    authors: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        rating: true,
                        image: true,
                    },
                    reviews: {
                        id: true,
                        bookId: true,
                        readerId: true,
                        rating: true,
                        comment: true,
                        reader: {
                            firstName: true,
                            lastName: true
                        }
                    }
                }
            })
            if (!book) throw new NotFoundException("Book doesn't exist")
            return book
        }
        catch (err) {
            console.log(err)
        }
    }

    async getAll(): Promise<Book[]> {
        try {
            return await this.bookRepository.find({
                relations: {
                    authors: true,
                    genres: true
                },
                select: {
                    genres: {
                        name: true
                    }
                }
            })
        }
        catch (err) {
            console.log(err)
        }
    }

    async create(book: CreateBookDto) {
        try {
            const { name, numberOfPages, publicationDate, authorIds, genreNames, image } = book
            const authors: Author[] = await this.authorRepository.find({
                where: {
                    id: In(authorIds)
                },
                relations: {
                    books: true
                }
            })
            const genres: Genre[] = await this.genreRepository.find({
                where: {
                    name: In(genreNames)
                },
                relations: {
                    books: true
                }
            })
            if (!authors.length) throw new NotFoundException("Authors with given ids doesnt exist")
            if (!genres.length) throw new NotFoundException("You must provides valid genres for this book")
            const newBook: Book = new Book()
            newBook.name = name
            newBook.numberOfPages = numberOfPages
            newBook.publicationDate = publicationDate
            newBook.authors = authors
            newBook.genres = genres
            newBook.image = image

            await this.bookRepository.save(newBook)
            authors.forEach(author => {
                author.books.push(newBook)
            })

            genres.forEach(genre => {
                genre.books.push(newBook)
            })

            await this.genreRepository.save(genres)
            await this.authorRepository.save(authors)
        }
        catch (err) {
            throw new Error(err)
        }
    }

    async update(id: number, bookProps: UpdateBookDto): Promise<Book> {
        try {
            let book = await this.bookRepository.findOneBy({ id })
            if (!book) throw new NotFoundException("Book with given id doesn't exist")
            book = {
                ...book,
                ...bookProps
            }
            return await this.bookRepository.save(book)
        }
        catch (err) {
            console.log(err)
        }
    }

    async delete(id: number) {
        try {
            const book: Book = await this.bookRepository.findOne({
                where: {
                    id
                },
                relations: {
                    authors: true,
                    reviews: true,
                    genres: {
                        books: true
                    }
                },
                select: {
                    id: true,
                    numberOfReviews: true,
                    rating: true,
                    authors: {
                        id: true
                    },
                    reviews: {
                        readerId: true
                    },
                    genres: {
                        id: true,
                        books: true
                    }
                }
            })
            if (!book) throw new NotFoundException("Book with given id doesn't exist")

            // pokupljam sve zanrove, koji poseduju datu knjigu
            const genres: Genre[] = book.genres

            // u svakom zanru u njegovoj listi knjiga koje poseduje, filtriramo knjigu koju brisemo
            for (const genre of genres) {
                genre.books = genre.books.filter((book: Book) => book.id !== id)
                await this.genreRepository.save(genre)
            }

            // // brisemo iz veze vise na vise, pa onda obrisemo knjigu
            await this.reviewRepository.delete({
                book: {
                    id
                }
            })

            if (book.authors.length) {
                const authors: Author[] = await this.authorRepository.find({
                    where: {
                        id: In(Array(book.authors.length).fill(0).map((_, i) => book.authors[i].id))
                    },
                    relations: {
                        books: true
                    },
                    select: {
                        id: true,
                        rating: true,
                        numberOfReviews: true,
                        books: {
                            id: true
                        }
                    }
                })

                for (const author of authors) {
                    author.books = author.books.filter((book: Book) => book.id !== id)
                    // brisemo autora ukoliko nakon brisanja knjige nije napisao nijednu i updejtujemo
                    // ocenu i broj recenzija

                    if (author.numberOfReviews === book.numberOfReviews) {
                        author.rating = 0
                        author.numberOfReviews = 0
                    }
                    else {
                        // ovde sam napravio malu gresku prilikom updejtovanja ocene, tako da cu to morati da ispravim
                        author.rating = (author.rating * author.numberOfReviews - book.numberOfReviews * book.rating) / (author.numberOfReviews - book.numberOfReviews)
                        author.numberOfReviews -= book.numberOfReviews
                    }

                    if (!author.books.length) {
                        await this.authorRepository.delete(author.id)
                    }
                    else
                        await this.authorRepository.save(author)
                }
            }

            return await this.bookRepository.delete(id)
        }
        catch (err) {
            console.log(err)
        }
    }
}

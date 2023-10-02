import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAuthorDto, UpdateAuthorDto } from './dto';
import { Author } from 'src/entities/author.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, MoreThan, Repository } from 'typeorm';
import { IGetAuthorParams } from './interfaces';
import { Book } from 'src/entities/book.entity';
import { Review } from 'src/entities/review.entity';
import { Genre } from 'src/entities/genre.entity';

@Injectable()
export class AuthorService {
    constructor(
        @InjectRepository(Author) private readonly authorRepository: Repository<Author>,
        @InjectRepository(Book) private readonly bookRepository: Repository<Book>,
        @InjectRepository(Review) private readonly reviewRepository: Repository<Review>,
        @InjectRepository(Genre) private readonly genreRepository: Repository<Genre>,
    ) { }

    async filterAuthors(filters: IGetAuthorParams): Promise<Author[]> {
        try {
            const authors = await this.authorRepository.find({
                relations: {
                    books: {
                        genres: true
                    }
                },
                select: {
                    books: {
                        id: true,
                        name: true,
                        image: true,
                        // za sada neka ovo bude opciono
                        // name: true,
                        // numberOfReviews: true,
                        // rating: true,
                        // image: true
                        publicationDate: true,
                        genres: {
                            name: true
                        }
                    }
                },
                where: filters,
            })
            return authors
        }
        catch (err) {
            throw new Error(err)
        }
    }

    async get(id: number) {
        try {
            return await this.authorRepository.findOne({
                where: {
                    id
                },
                relations: {
                    books: {
                        genres: true
                    }
                },
                select: {
                    books: {
                        id: true,
                        name: true,
                        numberOfReviews: true,
                        rating: true,
                        image: true,
                        genres: {
                            name: true
                        }
                    }
                }
            })
        }
        catch (err) {
            console.log(err)
        }
    }

    async create(author: CreateAuthorDto): Promise<Author> {
        try {
            return await this.authorRepository.save(author)
        }
        catch (err) {
            throw new Error(err)
        }
    }

    async update(id: number, authorProps: UpdateAuthorDto) {
        try {
            let author = await this.authorRepository.findOneBy({ id })
            if (!author) throw new NotFoundException()
            author = {
                ...author,
                ...authorProps
            }
            return await this.authorRepository.save(author)
        }
        catch (err) {
            throw new Error(err)
        }
    }

    // dakle ovu privilegiju bi trebao da ima admin
    async addSingleBook(authorId: number, bookId: number) {
        try {
            const author = await this.authorRepository.findOne({
                where: {
                    id: authorId
                },
                relations: {
                    books: true
                }
            })
            if (!author) throw new NotFoundException("Author with given id doesn't exist")

            const book = await this.bookRepository.findOne({
                where: {
                    id: bookId
                },
                relations: {
                    authors: true
                }
            })
            if (!book) throw new NotFoundException("Book with given id doesn't exist")

            if (author.books.some(book => book.id === bookId)) {
                // baza podataka sama po sebi ne dozovljava da se isti pisac doda istoj knjizi vise puta ali cisto da se ispise i ta poruka
                throw new Error("Given author is already added as an author for this book")
            }
            else {
                author.books.push(book)
            }

            book.authors.push(author)
            await this.authorRepository.save(author)
            await this.bookRepository.save(book)
        }
        catch (err) {
            console.log(err)
        }
    }

    async delete(id: number) {
        try {
            const author: Author = await this.authorRepository.findOne({
                where: {
                    id
                },
                relations: {
                    books: {
                        authors: true,
                        genres: {
                            books: true
                        }
                    }
                }
            })
            if (!author) throw new NotFoundException("Author with given id doesn't exist")
            await this.authorRepository.delete(id)
            const books: Book[] = author.books

            for (const book of books) {
                // knjiga ima samo jednog autora, sto znaci da vrsimo brisanje knjige
                if (book.authors.length === 1) {
                    await this.reviewRepository.delete({
                        book: {
                            id: book.id
                        }
                    })
                    for (const genre of book.genres) {
                        genre.books = genre.books.filter(genreBook => genreBook.id !== book.id)
                        await this.genreRepository.save(genre)
                    }
                    await this.bookRepository.delete(book.id)
                }
            }
        }
        catch (err) {
            console.log(err)
        }
    }
    // test metoda
    async deleteAll() {
        try {
            const authors = await this.filterAuthors({})
            for (const author of authors) {
                await this.delete(author.id)
            }
        } catch (err) {
            throw new Error(err)
        }
    }
}

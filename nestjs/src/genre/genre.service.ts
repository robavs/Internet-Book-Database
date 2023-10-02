import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Genre } from 'src/entities/genre.entity';
import { In, Repository } from 'typeorm';
import { CreateGenreDto, UpdateGenreDto } from './dto';
import { Book } from 'src/entities/book.entity';
import { Author } from 'src/entities/author.entity';
import { BookService } from 'src/book/book.service';

@Injectable()
export class GenreService {
    constructor(
        @InjectRepository(Genre) private readonly genreRepository: Repository<Genre>,
        @InjectRepository(Book) private readonly bookRepository: Repository<Book>,
        @InjectRepository(Author) private readonly authorRepository: Repository<Author>,
        private readonly bookService: BookService) { }

    async getAllGenresWithBooksAndAuthors(): Promise<Genre[]> {
        try {
            return await this.genreRepository.find({
                relations: {
                    books: {
                        authors: true
                    }
                },
                select: {
                    books: {
                        id: true, // msm da ovo mora jer moze da se desi da neke knjige imaju ista imena
                        name: true,
                        numberOfPages: true,
                        rating: true,
                        numberOfReviews: true,
                        publicationDate: true,
                        authors: {
                            id: true, // isti komentar i ovde vazi, moracu da proverim
                            firstName: true,
                            lastName: true,
                            rating: true
                        }
                    }
                }
            })
        }
        catch (err) {
            console.log(err)
        }
    }

    async create(genre: CreateGenreDto): Promise<Genre> {
        try {
            return await this.genreRepository.save(genre)
        }
        catch (err) {
            console.log(err)
        }
    }

    async update(name: string, genreProps: UpdateGenreDto): Promise<Genre> {
        try {
            let genre = await this.genreRepository.findOne({
                where: {
                    name
                }
            })
            if (!genre) throw new NotFoundException("Genre with given id doesn't exist")
            if (genreProps.description?.length < 50 || genreProps.description?.length > 2000) throw new Error("Description must be between 50 and 2000 characters")
            genre = {
                ...genre,
                ...genreProps
            }
            return await this.genreRepository.save(genre)
        }
        catch (err) {
            console.log(err)
        }
    }

    async addGenresToBook(genreNames: string[], bookId: number): Promise<void> {
        try {
            const { genres, book } = await this.getBookWithGenres(genreNames, bookId)

            // ovo bi se radilo u slucaju da nemamo definisanu kaskadu 
            // pa nije neophodno da obe strane vrse dodavanje i save
            // for (const genre of genres) {
            //     genre.books.push(book)
            //     // await this.genreRepository.save(genre)
            // }

            book.genres.push(...genres)
            await this.bookRepository.save(book)
        }
        catch (err) {
            console.log(err)
        }
    }

    // ovom metodom zelim da obrisem zanrove iz date knjige, takoreci ovo brise samo veze vise na vise
    async deleteGenresFromBook(genreNames: string[], bookId: number): Promise<void> {
        try {
            const { book } = await this.getBookWithGenres(genreNames, bookId)
            book.genres = book.genres.filter(genre => !genreNames.includes(genre.name))

            // ukoliko smo obrisali sve zanrove brisemo knjigu, poziv je samo zbog vezbe, inace msm 
            // da je glupo da se to radi
            // if (!book.genres.length) {
            //     await this.bookService.delete(bookId)
            // nakon sto bi se obrisala knjiga, onda mora da se hendluje brisanje
            // Review tabele, tako da bi i to trebalo da se uzme u obzir 
            // kad brisemo knjigu u ovoj metodi
            // }
            await this.bookRepository.save(book)
        }
        catch (err) {
            console.log(err)
        }
    }

    async getBookWithGenres(genreNames: string[], bookId: number): Promise<{ genres: Genre[], book: Book }> {
        try {
            const book: Book = await this.bookRepository.findOne({
                where: {
                    id: bookId
                },
                relations: {
                    genres: true
                }
            })
            if (!book) throw new NotFoundException("Book doesn't exist")
            const genres: Genre[] = await this.genreRepository.find({
                where: {
                    name: In(genreNames)
                },
                relations: {
                    books: true
                }
            })
            if (!genres.length) throw new NotFoundException("Not valid genre names provided")
            return {
                genres,
                book
            }
        }
        catch (err) {
            console.log(err)
        }
    }
}

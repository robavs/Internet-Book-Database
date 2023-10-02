import { Body, Controller, Post, Query, Get, Delete, ParseIntPipe, Put, Param, ParseArrayPipe } from '@nestjs/common';
import { CreateAuthorDto, UpdateAuthorDto } from './dto';
import { Author } from 'src/entities/author.entity';
import { AuthorService } from './author.service';
import { Between, In } from 'typeorm';
import { IGetAuthorParams } from './interfaces';
import { Roles } from 'src/custom/decorators';
import { Role } from 'src/models/enums';

@Controller('author')
export class AuthorController {
    constructor(private readonly authorService: AuthorService) { }

    @Roles(Role.Moderator, Role.Reader)
    @Get("/getAuthors")
    async filterAuthors(
        @Query("firstName") firstName?: string,
        @Query("lastName") lastName?: string,
        @Query("genres") genres?: string[],
        @Query("minRating") minRating: number = 0,
        @Query("maxRating") maxRating: number = 10,
        @Query("country") country?: string,
        @Query("dateFrom") dateFrom: Date = new Date("1900-01-01"),
        @Query("dateTo") dateTo: Date = new Date()
    ): Promise<Author[]> {
        const filters: IGetAuthorParams = {
            rating: Between(minRating, maxRating),
            country,
            firstName,
            lastName,
            books: {
                // izgleda da kad autor nema knjige, prosto mi vrati samo one koje imaju
                // knjige
                // publicationDate: Between(dateFrom, dateTo),
                ...(genres?.length && {
                    genres: {
                        name: In(genres)
                    }
                })
            }
        }

        return await this.authorService.filterAuthors(filters)
    }

    @Roles(Role.Moderator, Role.Reader)
    @Get("get/:id")
    async get(@Param("id", ParseIntPipe) id: number) {
        return await this.authorService.get(id)
    }

    @Roles(Role.Moderator)
    @Post("/create")
    async createAuthor(@Body() author: CreateAuthorDto): Promise<Author> {
        return await this.authorService.create(author)
    }

    @Roles(Role.Moderator)
    @Put("/addSingleBook/:authorId/:bookId")
    async addSingleBook(
        @Param("authorId", ParseIntPipe) authorId: number,
        @Param("bookId", ParseIntPipe) bookId: number) {
        return await this.authorService.addSingleBook(authorId, bookId)
    }

    @Roles(Role.Moderator)
    @Put("/update/:id")
    async updateAuthor(
        @Param("id", ParseIntPipe) id: number,
        @Body() authorProps: UpdateAuthorDto
    ) {
        return await this.authorService.update(id, authorProps)
    }

    @Roles(Role.Moderator)
    @Delete("/delete/:id")
    async delete(@Param("id", ParseIntPipe) id: number) {
        return await this.authorService.delete(id)
    }

    // test metoda
    @Roles(Role.Moderator)
    @Delete("deleteAll")
    async deleteAll() {
        return await this.authorService.deleteAll()
    }
}

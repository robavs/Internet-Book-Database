import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { GenreService } from './genre.service';
import { AddGenresToBookDto, CreateGenreDto, UpdateGenreDto } from './dto';
import { Genre } from 'src/entities/genre.entity';
import { Roles } from 'src/custom/decorators';
import { Role } from 'src/models/enums';

@Controller('genre')
export class GenreController {
    constructor(private readonly genreService: GenreService) { }

    @Roles(Role.Reader, Role.Moderator)
    @Get("getAllGenresWithBooksAndAuthors")
    async getAllGenresWithBooksAndAuthors(): Promise<Genre[]> {
        return await this.genreService.getAllGenresWithBooksAndAuthors()
    }

    @Roles(Role.Moderator)
    @Post("/create")
    async create(@Body() genre: CreateGenreDto): Promise<Genre> {
        return await this.genreService.create(genre)
    }

    @Roles(Role.Moderator)
    @Put("/update/:name")
    async update(@Param("name") name: string, @Body() genreProps: UpdateGenreDto): Promise<Genre> {
        return await this.genreService.update(name, genreProps)
    }

    @Roles(Role.Moderator)
    @Post("/addGenresToBook")
    async addGenresToBook(@Body() { genreNames, bookId }: AddGenresToBookDto): Promise<void> {
        return await this.genreService.addGenresToBook(genreNames, bookId)
    }

    @Roles(Role.Moderator)
    @Delete("/deleteGenresFromBook")
    async deleteGenresFromBook(@Body() { genreNames, bookId }: AddGenresToBookDto) {
        return await this.genreService.deleteGenresFromBook(genreNames, bookId)
    }
}

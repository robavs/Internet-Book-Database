import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto, UpdateBookDto } from './dto';
import { Book } from 'src/entities/book.entity';
import { Public, Roles } from 'src/custom/decorators';
import { Role } from 'src/models/enums';

@Controller('book')
export class BookController {
    constructor(private readonly bookService: BookService) { }

    @Roles(Role.Moderator, Role.Reader)
    @Get("/getAll")
    async getAll() {
        return await this.bookService.getAll()
    }

    @Roles(Role.Moderator, Role.Reader)
    @Get("/get/:id")
    async get(@Param("id", ParseIntPipe) id: number) {
        return await this.bookService.get(id)
    }

    @Roles(Role.Moderator)
    @Post("/create")
    async create(@Body() book: CreateBookDto) {
        return await this.bookService.create(book)
    }

    @Roles(Role.Moderator)
    @Put("/update/:id")
    async update(@Param("id", ParseIntPipe) id: number, @Body() bookProps: UpdateBookDto): Promise<Book> {
        return await this.bookService.update(id, bookProps)
    }

    @Roles(Role.Moderator)
    @Delete("/delete/:id")
    async delete(@Param("id", ParseIntPipe) id: number) {
        return await this.bookService.delete(id)
    }
}

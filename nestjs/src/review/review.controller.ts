import { Body, Delete, Controller, Param, ParseIntPipe, Post, Put, Get } from '@nestjs/common';
import { CreateReviewDto, UpdateReviewDto } from './dto';
import { ReviewService } from './review.service';
import { Reader } from 'src/entities/reader.entity';
import { Review } from 'src/entities/review.entity';
import { Roles } from 'src/custom/decorators';
import { Role } from 'src/models/enums';

@Controller('review')
export class ReviewController {
    constructor(private readonly reviewService: ReviewService) { }

    @Roles(Role.Moderator, Role.Reader)
    @Get("/getReadersReviews/:readerId")
    async getReadersReviews(@Param("readerId", ParseIntPipe) readerId: number): Promise<Reader> {
        return await this.reviewService.getReadersReviews(readerId)
    }

    @Roles(Role.Reader)
    @Post("/create/:readerId/:bookId")
    async create(
        @Param("readerId", ParseIntPipe) readerId: number,
        @Param("bookId", ParseIntPipe) bookId: number,
        @Body() reviewProps: CreateReviewDto
    ): Promise<CreateReviewDto> {
        return await this.reviewService.create(readerId, bookId, reviewProps)
    }

    @Roles(Role.Reader)
    @Put("/update/:readerId/:bookId")
    async update(
        @Param("readerId", ParseIntPipe) readerId: number,
        @Param("bookId", ParseIntPipe) bookId: number,
        @Body() reviewProps: UpdateReviewDto): Promise<Review> {
        return await this.reviewService.update(readerId, bookId, reviewProps)
    }
}

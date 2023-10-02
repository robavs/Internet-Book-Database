import { IsInt, IsString, Length, Max, Min } from "class-validator"

export class CreateReviewDto {
    @IsInt()
    @Min(1)
    @Max(10)
    rating: number

    @IsString()
    @Length(5, 500)
    comment: string
}
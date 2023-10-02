import { IsArray, IsDate, IsDateString, IsInt, IsString, Length, Min } from "class-validator"

export class CreateBookDto {
    @Length(1, 100)
    name: string

    @IsInt()
    @Min(1)
    numberOfPages: number

    @IsString()
    image: string

    @IsDateString()
    publicationDate: Date

    @IsInt({ each: true })
    authorIds: number[]

    @IsString({ each: true })
    genreNames: string[]
}
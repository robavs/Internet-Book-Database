import { IsInt, IsString } from "class-validator"

export class AddGenresToBookDto {
    @IsString({ each: true })
    genreNames: string[]

    @IsInt()
    bookId: number
}
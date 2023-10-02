import { IsString, Length } from "class-validator"

export class CreateGenreDto {
    @IsString()
    name: string

    @IsString()
    @Length(50, 2000)
    description: string
}
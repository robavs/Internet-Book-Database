import { IsInt, IsOptional, IsString, Length, Max, Min } from "class-validator"

export class CreateAuthorDto {
    @IsString()
    @Length(3, 20)
    firstName: string

    @IsString()
    @Length(3, 20)
    lastName: string

    @IsString()
    @Length(50, 2000)
    biography: string

    @IsString()
    @Length(2, 30)
    country: string

    @IsString()
    image: string
}
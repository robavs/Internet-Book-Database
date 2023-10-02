import { IsEmail, IsString, Length } from "class-validator";

export class UserSigninDto {
    @IsEmail()
    email: string

    @IsString()
    @Length(3, 30)
    password: string
}
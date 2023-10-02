import { IsEmail, IsString, Length } from "class-validator";

export class UpdatePasswordDto {
    @IsEmail()
    email: string

    @IsString()
    @Length(3, 30)
    oldPassword: string

    @IsString()
    @Length(3, 30)
    newPassword: string
}
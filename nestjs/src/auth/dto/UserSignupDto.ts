import { IsEmail, IsEnum, IsString, Length } from "class-validator"
import { Role } from "src/models/enums"

export class UserSignupDto {
    @IsString()
    @Length(3, 20)
    firstName: string

    @IsString()
    @Length(3, 20)
    lastName: string

    @IsEmail()
    email: string

    @IsString()
    @Length(3, 30)
    password: string

    @IsEnum(Role)
    role: Role
}
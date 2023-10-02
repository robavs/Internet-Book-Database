import { User } from "src/entities/user.entity";
import { AuthService } from "./auth.service";
import { Body, Controller, Get, Param, ParseIntPipe, Post, Put } from "@nestjs/common";
import { UpdatePasswordDto, UserSigninDto, UserSignupDto } from "./dto";
import { Tokens } from "src/models/types";
import { GetCurrentUserId, Public, Roles } from "src/custom/decorators";
import { Role } from "src/models/enums";

@Controller()
export class AuthControler<T extends User>{
    constructor(private readonly authService: AuthService<T>) { }

    @Public()
    @Post("/signup")
    async signup(@Body() credentials: UserSignupDto): Promise<Tokens> {
        return await this.authService.signup(credentials)
    }

    @Public()
    @Post("/signin")
    async signin(@Body() credentials: UserSigninDto): Promise<Tokens> {
        return await this.authService.signin(credentials)
    }

    @Roles(Role.Moderator, Role.Reader)
    @Post("/logout/:userId")
    async logout(@Param("userId", ParseIntPipe) userId: number): Promise<void> {
        return await this.authService.logout(userId)
    }

    @Roles(Role.Moderator, Role.Reader)
    @Put("/updatePassword")
    async updatePassword(@Body() credentials: UpdatePasswordDto): Promise<any> {
        return await this.authService.updatePassword(credentials)
    }

    @Roles(Role.Moderator, Role.Reader)
    @Get("/getUserId/:accessToken")
    async getUserId(@Param("accessToken") accessToken: string): Promise<number> {
        return await this.authService.getUserIdFromAccessToken(accessToken)
    }
}
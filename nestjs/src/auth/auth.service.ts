import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/entities/user.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { UpdatePasswordDto, UserSigninDto, UserSignupDto } from './dto';
import { Role } from 'src/models/enums';
import { Reader } from 'src/entities/reader.entity';
import { Moderator } from 'src/entities/moderator.entity';
import * as bcrypt from 'bcrypt'
import { JwtPayload, Tokens } from 'src/models/types';
import { jwtConstants } from './constants';

@Injectable()
export class AuthService<T extends User> {
    private jwtService: JwtService

    constructor(private readonly repository: Repository<T>) {
        this.jwtService = new JwtService()
    }

    async signup(credentials: UserSignupDto): Promise<Tokens> {
        try {
            let user: User

            switch (credentials.role) {
                case Role.Reader:
                    user = new Reader()
                    user.role = Role.Reader
                    break
                case Role.Moderator:
                    user = new Moderator()
                    user.role = Role.Moderator
                    break
                default:
                    throw new Error("Unknown user type")
            }
            user.email = credentials.email
            user.firstName = credentials.firstName
            user.lastName = credentials.lastName
            user.password = await bcrypt.hash(credentials.password, 10)
            await this.repository.save(user as T)

            const tokens = await this.generateTokens(user.id, user.email, user.role)
            await this.updateHashedRt(user, tokens.refresh_token)

            return tokens
        }
        catch (err) {
            throw new Error(err)
        }
    }

    async signin(credentials: UserSigninDto): Promise<Tokens> {
        const user: T = await this.repository.findOneBy({
            email: credentials.email
        } as FindOptionsWhere<T>)

        if (!user) {
            throw new ForbiddenException("User with given email doesn't exist")
        }

        const passwordMathces = await bcrypt.compare(credentials.password, user.password)
        if (!passwordMathces) {
            throw new UnauthorizedException("Wrong password provided")
        }

        const tokens = await this.generateTokens(user.id, user.email, user.role)
        await this.updateHashedRt(user, tokens.refresh_token)
        return tokens
    }

    async logout(userId: number): Promise<void> {
        const user: T = await this.repository.findOneBy({
            id: userId
        } as FindOptionsWhere<T>)

        if (user.hashedRt) {
            user.hashedRt = null
            await this.repository.save(user)
        }
    }

    async updatePassword({ email, oldPassword, newPassword }: UpdatePasswordDto): Promise<any> {
        try {
            const user: T = await this.repository.findOneBy({
                email
            } as FindOptionsWhere<T>)

            if (!user) {
                throw new Error("User with given email doesn't exist")
            }

            const correctPassword = await bcrypt.compare(oldPassword, user.password)
            if (!correctPassword) {
                throw new Error("Wrong password provided")
            }

            user.password = await bcrypt.hash(newPassword, 10)
            await this.repository.save(user)
            return { email, oldPassword, newPassword }
        }
        catch (err) {
            throw new Error()
        }
    }

    async updateHashedRt(user: User, rf: string): Promise<void> {
        user.hashedRt = await bcrypt.hash(rf, 10)
        await this.repository.save(user as T)
    }

    async generateTokens(userId: number, email: string, role: Role): Promise<Tokens> {
        const jwtPayload: JwtPayload = {
            sub: userId,
            email,
            role
        }

        const [at, rt] = await Promise.all([
            this.jwtService.signAsync(jwtPayload, {
                secret: jwtConstants.ACCESS_TOKEN_KEY,
                expiresIn: "15m"
            }),
            this.jwtService.signAsync(jwtPayload, {
                secret: jwtConstants.REFRESH_TOKEN_KEY,
                expiresIn: "7d"
            })
        ])

        return {
            access_token: at,
            refresh_token: rt
        }
    }

    async getUserIdFromAccessToken(accessToken: string): Promise<number> {
        try {
            const splitToken: string[] = accessToken.split(".")
            if (splitToken.length !== 3) throw new Error("Ivalid token!")

            const payload: JwtPayload = JSON.parse(atob(splitToken[1]));

            return payload.sub
        }
        catch (err) {
            throw new Error(err)
        }
    }
}

import { Role } from "../enums"

export type JwtPayload = {
    email: string
    sub: number
    role: Role
}
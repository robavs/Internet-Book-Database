import { Role } from "./Role"

export interface UserSignin {
    email: string
    password: string
    role: Role
}
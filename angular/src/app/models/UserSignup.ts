import { Role } from "./Role"

export interface UserSignup {
    firstName: string,
    lastName: string,
    role: Role,
    email: string
    password: string
}
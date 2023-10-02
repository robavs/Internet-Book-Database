import { Role } from "./Role"

export interface User {
    role: Role
    accessToken: string
    email: string
}
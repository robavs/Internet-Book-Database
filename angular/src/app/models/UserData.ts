import { Role } from "./Role"

export interface UserData {
    id: number
    firstName: string
    lastName: string
    email: string
    role: Role
    password: string
}
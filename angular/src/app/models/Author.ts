import { Book } from "./Book"

export interface Author {
    id: number
    firstName: string
    lastName: string
    biography: string
    country: string
    rating: number
    numberOfReviews: number
    image: string
    books: Book[]
}
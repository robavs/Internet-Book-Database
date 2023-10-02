import { Book } from "./Book"
import { Reader } from "./Reader"

export interface Review {
    id: number
    readerId: number
    bookId: number
    rating: number
    comment: string
    createdAt: Date
    updatedAt: Date
    book: Book
    reader: Reader
}
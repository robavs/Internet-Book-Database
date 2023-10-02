import { Author } from "./Author"
import { Genre } from "./Genre"
import { Review } from "./Review"

export interface Book {
    id: number
    name: string
    publicationDate: Date
    numberOfPages: number
    rating: number
    numberOfReviews: number
    image: string
    authors: Author[]
    genres: Genre[]
    reviews: Review[]
}
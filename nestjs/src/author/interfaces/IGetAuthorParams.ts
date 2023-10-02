import { FindOperator } from "typeorm"

export interface IGetAuthorParams {
    rating?: FindOperator<number>,
    firstName?: string
    lastName?: string
    country?: string
    books?: {
        genres?: {
            name?: FindOperator<string>
        }
        publicationDate?: FindOperator<Date>
    }
}
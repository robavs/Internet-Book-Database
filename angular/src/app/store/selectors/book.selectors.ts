import { createSelector } from "@ngrx/store";
import { Book } from "src/app/models";
import AppState from "src/app/app.state";

export const selectBooksFeature = createSelector(
    (state: AppState) => state.books,
    (books) => books
)

export const selectBooksList = createSelector(
    selectBooksFeature,
    (books) => ({
        books: books.ids
            .map((id: string | number) => books.entities[id])
            .filter((book: Book | undefined) => book !== undefined)
            .map((book: Book | undefined) => book as Book),
        isLoading: books.isLoading
    })
)
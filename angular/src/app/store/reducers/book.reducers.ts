import { State, createReducer, on } from "@ngrx/store";
import { EntityAdapter, EntityState, createEntityAdapter } from "@ngrx/entity"
import * as Actions from '../actions/book.actions'
import { Book } from "src/app/models";

export interface BooksState extends EntityState<Book> {
    selectedBookId: number | null,
    isLoading: boolean
}

export const adapter: EntityAdapter<Book> = createEntityAdapter<Book>();

export const initalState: BooksState = adapter.getInitialState({
    selectedBookId: null,
    isLoading: true
})

export const bookReducer = createReducer(
    initalState,
    on(Actions.loadBooks, (state) => {
        return { ...state, isLoading: true }
    }),
    on(Actions.loadBooksSuccess, (state, { books }) => {
        return { ...adapter.setAll(books, state), isLoading: false }
    }),
    // sad ovde treba dodam za azuriranje i te gluposti
)
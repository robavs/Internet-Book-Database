import { createAction, props } from "@ngrx/store";
import { Book } from "src/app/models";

export const loadBooks = createAction(
    "[Book Page] Load Books"
)

export const loadBooksSuccess = createAction(
    "[Book Page] Load Books Success",
    props<{ books: Book[], isLoading: boolean }>()
)

export const loadBooksFail = createAction(
    "[Book Page] Load Books Fail"
)
// sto posto ce treba i nesto za dinamicke
// rute da se odradi

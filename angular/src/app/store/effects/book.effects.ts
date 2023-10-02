import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType, } from "@ngrx/effects";
import { BookService } from "src/app/services/book.service";
import * as BookActions from '../actions/book.actions'
import { catchError, exhaustMap, finalize, map, of } from "rxjs";
import { Store } from "@ngrx/store";
import AppState from "src/app/app.state";
import { BooksComponent } from "src/app/reader-interface/books/books.component";

@Injectable()
export class BookEffects {
    constructor(private actions$: Actions, private bookService: BookService, private store: Store<AppState>) { }

    loadBooks$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(BookActions.loadBooks),
            exhaustMap(() => {
                return this.bookService.getAll()
                    .pipe(
                        map((books) => {
                            return BookActions.loadBooksSuccess({ books, isLoading: false })
                        }),
                        catchError(() => {
                            return of(BookActions.loadBooksFail)
                        }),
                        finalize(() => {
                        })
                    )
            })
        )
    })
}
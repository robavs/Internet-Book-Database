import { Injectable } from "@angular/core"
import { Actions, createEffect, ofType } from "@ngrx/effects"
import { Store } from "@ngrx/store"
import AppState from "src/app/app.state"
import { ReviewService } from "src/app/services/review.service"
import * as ReviewActions from "../actions/review.actions"
import { catchError, exhaustMap, map, of, switchMap } from "rxjs"
import { Review } from "src/app/models"

@Injectable()
export class ReviewEffect {
    constructor(private actions$: Actions,
        private reviewService: ReviewService,
        private store: Store<AppState>) { }

    createReview$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(ReviewActions.createReview),
            switchMap((action) => {
                const { readerId, bookId, reviewData: data } = action
                return this.reviewService.addReview(data, readerId, bookId).pipe(
                    map((review: Review) => {
                        this.reviewService.errors$.next(["Successfully added review"])
                        return ReviewActions.createReviewSuccess({
                            reviewData: {
                                ...review,
                                createdAt: new Date(),
                                updatedAt: new Date(),
                            },
                            isLoading: false
                        })
                    }),
                    catchError(() => {
                        this.reviewService.errors$.next(["Error"])
                        return of(ReviewActions.createReviewFail)
                    })
                )
            })
        )
    })

}
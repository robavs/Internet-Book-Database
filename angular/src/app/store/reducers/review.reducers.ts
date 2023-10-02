import { EntityAdapter, EntityState, createEntityAdapter } from "@ngrx/entity";
import { Review } from "src/app/models";
import * as Actions from '../actions/review.actions'
import { createReducer, on } from "@ngrx/store";
import { AddReview } from "src/app/models/AddReview";

export interface ReviewState extends EntityState<Review> {
    selectedBookId: number | null
    selctedReaderId: number | null
}

export const reviewData: AddReview = {
    rating: 0,
    comment: ""
}

export const adapter: EntityAdapter<Review> = createEntityAdapter<Review>()

export const initalState: ReviewState = adapter.getInitialState({
    selectedBookId: null,
    selctedReaderId: null
})

export const reviewDataReducer = createReducer(
    reviewData,
    on(Actions.setReviewData, (reviewData, { property, value }) => {
        return { ...reviewData, [property]: value }
    })
)

export const reviewReducer = createReducer(
    initalState,
    on(Actions.createReview, (state) => {
        return { ...state, isLoading: true }
    }),
    on(Actions.createReviewSuccess, (state, { reviewData }) => {
        return { ...adapter.addOne(reviewData, state), isLoading: false }
    }),
    on(Actions.updateReview, (state) => {
        return { ...state, isLoading: true }
    }),
    on(Actions.updateReviewSuccess, (state, { reviewData }) => {
        return { ...adapter.updateOne(reviewData, state), isLoading: false }
    })
)
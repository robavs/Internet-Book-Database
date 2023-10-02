import { Update } from "@ngrx/entity";
import { createAction, props } from "@ngrx/store";
import { AddReview } from "src/app/models/AddReview";
import { Review } from "src/app/models/Review";

export const setReviewData = createAction(
    "[Review] Set Review Data",
    props<{ property: keyof AddReview, value: string | number }>()
)

export const createReview = createAction(
    "[Review] Add Review",
    props<{ readerId: number, bookId: number, reviewData: AddReview }>()
)

export const createReviewSuccess = createAction(
    "[Review] Add Review Success",
    props<{ reviewData: Review, isLoading: boolean }>()
)

export const createReviewFail = createAction(
    "[Review] Add Review Fail"
)

export const updateReview = createAction(
    "[Review] Update Review"
)

export const updateReviewSuccess = createAction(
    "[Review] Update Review Success",
    props<{ reviewData: Update<Review>, isLoading: boolean }>()
)

export const updateReviewFail = createAction(
    "[Review] Update Review Fail"
)
import { AddReview } from "src/app/models/AddReview";

export const selectAddReviewData = (state: { addReviewData: AddReview }) => state.addReviewData

export const selectUpdateReviewData = (state: { updateReviewData: AddReview }) => state.updateReviewData
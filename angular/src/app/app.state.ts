import { UpdatePasssword, UserSignin, UserSignup } from "./models";
import { AddReview } from "./models/AddReview";
import { BooksState } from "./store/reducers/book.reducers";
import { ReviewState } from "./store/reducers/review.reducers";

export default interface AppState {
    books: BooksState
    userSigninCredentials: UserSignin
    userSignupCredentials: UserSignup
    updatePasswordData: UpdatePasssword
    review: ReviewState,
    addReviewData: AddReview
}
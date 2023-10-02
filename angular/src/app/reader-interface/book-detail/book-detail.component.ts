import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Book } from 'src/app/models';
import { Author } from 'src/app/models/Author';
import { Review } from 'src/app/models/Review';
import { BookService } from 'src/app/services/book.service';
import { SpinnerComponent } from 'src/app/shared-components/spinner/spinner.component';
import { CommonModule } from '@angular/common';
import { AuthorService } from 'src/app/services/author.service';
import { AuthService } from 'src/app/services/auth.service';
import { MatDividerModule } from '@angular/material/divider';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AddReview } from 'src/app/models/AddReview';
import { Store } from '@ngrx/store';
import AppState from 'src/app/app.state';
import { selectAddReviewData, selectUpdateReviewData } from 'src/app/store/selectors/review.selectors';
import { createReview, setReviewData } from 'src/app/store/actions/review.actions';
import { MatListModule } from '@angular/material/list';
import { ReviewService } from 'src/app/services/review.service';

@Component({
    selector: 'app-book-detail',
    templateUrl: './book-detail.component.html',
    styleUrls: ['./book-detail.component.css'],
    standalone: true,
    imports: [MatListModule, MatButtonModule, MatInputModule, SpinnerComponent, CommonModule, MatDividerModule, FormsModule, MatFormFieldModule, MatIconModule]
})
export class BookDetailComponent {
    book$: BehaviorSubject<Book> = new BehaviorSubject<Book>({} as Book); // Definirajte varijablu za pohranu autora
    hasLoaded: boolean = false
    bookId: number = -1

    addReviewData: AddReview = {
        rating: 0,
        comment: ''
    }

    updateReviewData: AddReview = {
        rating: 0,
        comment: ''
    }

    constructor(
        private store: Store<AppState>,
        private authService: AuthService,
        private authorService: AuthorService,
        private route: ActivatedRoute,
        private bookService: BookService,
        public reviewService: ReviewService,
        private router: Router) { }

    authors: Author[] = []
    reviews: Review[] = []
    userId: number = 0
    userReview: Review | undefined = undefined

    ngOnInit(): void {
        this.bookId = parseInt(this.route.snapshot.params["id"]); // Pretvorite ID autora u broj, ako je potrebno

        this.bookService.getBookById(this.bookId)
            .subscribe({
                next: (book) => {
                    this.book$.next(book)
                    this.hasLoaded = true
                    this.authors = book.authors
                    this.reviews = book.reviews
                    this.userReview = this.reviews.find((review) => review.readerId === this.userId)
                }
            })

        this.authService.getIdFromAccessToken().subscribe({
            next: (userId) => {
                this.userId = userId
            }
        })

        this.store.select(selectAddReviewData).subscribe({
            next: (reviewData) => {
                this.addReviewData = reviewData
            }
        })
    }

    getUserReviewFromForm(property: keyof AddReview, value: string | number) {
        if (property === "rating") value = parseInt(value as string)
        this.store.dispatch(setReviewData({ property, value }))
    }

    addReview() {
        const ratingValue = this.addReviewData["rating"]
        const commentValue = this.addReviewData["comment"]

        if (!ratingValue || (ratingValue < 1 || ratingValue > 10)) {
            this.reviewService.errors$.next(["Rating must be between 1 and 10"])
            return
        }
        if (!commentValue) {
            this.reviewService.errors$.next(["You must write comment"])
            return
        }
        console.log(this.addReviewData)
        this.reviewService.errors$.next(["Processing"])

        this.store.dispatch(createReview({
            readerId: this.userId, bookId: this.bookId,
            reviewData: this.addReviewData
        }))

    }

    updateReview() {

    }

    goToBook(id: number) {
        this.bookService.goToBook(id)
    }

    goToAuthor(id: number) {
        this.authorService.goToAuthor(id)
    }
}

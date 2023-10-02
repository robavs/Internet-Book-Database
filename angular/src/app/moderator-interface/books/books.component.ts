import { Component, Input, OnInit } from '@angular/core';
import { BookService } from 'src/app/services/book.service';
import { CommonModule } from '@angular/common';
import { Book } from 'src/app/models/Book';
import { BehaviorSubject, Observable, of, skip, take, tap } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { PaginatorComponent } from 'src/app/shared-components/paginator/paginator.component';
import { SpinnerComponent } from 'src/app/shared-components/spinner/spinner.component';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { Author } from 'src/app/models/Author';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthorService } from 'src/app/services/author.service';
import { Store, select } from '@ngrx/store';
import { loadBooks, loadBooksSuccess } from 'src/app/store/actions/book.actions';
import { selectBooksList } from 'src/app/store/selectors/book.selectors';
import AppState from 'src/app/app.state';
import { leftShift } from 'mathjs';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-books-moderator',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.css'],
  standalone: true,
  imports: [MatButtonModule, MatDividerModule, CommonModule, PaginatorComponent, SpinnerComponent, MatCardModule, MatChipsModule]
})
export class BooksComponent {
  booksForCurrentPage$: Observable<Book[]> = of([])
  isLoading: boolean = true
  books$: Observable<Book[]> = of([])
  paginatorLength: number = 0

  constructor(
    private bookService: BookService,
    private store: Store<AppState>,
    private authorService: AuthorService) { }

  ngOnInit(): void {
    this.store.dispatch(loadBooks())

    this.store.select(selectBooksList).subscribe({
      next: ({ books, isLoading }) => {
        this.books$ = of(books)
        this.isLoading = isLoading
        this.booksForCurrentPage$ = of(books.slice(0, 5))
        this.paginatorLength = books.length
      }
    })
  }

  onChangingPage(event: PageEvent) {
    this.books$.subscribe({
      next: (books) => {
        this.booksForCurrentPage$ = of(books
          .slice(event.pageIndex * event.pageSize, (event.pageIndex + 1) * event.pageSize))
      }
    })
  }

  async deleteBook(id: number) {
    await this.bookService.deleteBook(id)
    // this.store.dispatch(loadBooks())
  }
}





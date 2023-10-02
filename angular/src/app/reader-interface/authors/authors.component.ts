import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { AuthorService } from 'src/app/services/author.service';
import { Author } from 'src/app/models/Author';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { SpinnerComponent } from 'src/app/shared-components/spinner/spinner.component';
import { PaginatorComponent } from 'src/app/shared-components/paginator/paginator.component';
import { ActivatedRoute, Router } from '@angular/router';
import { BookService } from 'src/app/services/book.service';

@Component({
  selector: 'author-list',
  templateUrl: './authors.component.html',
  styleUrls: ['./authors.component.css'],
  standalone: true,
  imports: [MatCardModule, CommonModule, SpinnerComponent, PaginatorComponent]
})
export class AuthorsComponent implements OnInit {

  constructor(private authorService: AuthorService,
    private router: Router,
    private route: ActivatedRoute,
    private bookService: BookService) { }

  authors$: BehaviorSubject<Author[]> = new BehaviorSubject<Author[]>([])
  authorsForCurrentPage$: Observable<Author[]> = of([])
  hasLoaded: number = 0

  ngOnInit(): void {
    this.authorService.getAuthors()
      .subscribe({
        next: (authors) => {
          this.authors$.next(authors)
          this.authorsForCurrentPage$ = of(authors.slice(0, 5))
          this.hasLoaded = authors.length
        }
      })
  }

  onChangingPage(event: PageEvent) {
    const authorByPage: Author[] = this.authors$.value.slice(
      event.pageIndex * event.pageSize, (event.pageIndex + 1) * event.pageSize
    )
    this.authorsForCurrentPage$ = of(authorByPage)
  }

  goToBook(id: number) {
    this.bookService.goToBook(id)
  }

  goToAuthor(id: number) {
    this.authorService.goToAuthor(id)
  }
}
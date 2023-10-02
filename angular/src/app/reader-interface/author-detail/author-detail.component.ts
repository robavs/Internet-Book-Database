import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Author } from 'src/app/models/Author';
import { AuthorService } from 'src/app/services/author.service';
import { CommonModule } from '@angular/common';
import { SpinnerComponent } from 'src/app/shared-components/spinner/spinner.component';
import { Book } from 'src/app/models';
import { MatDividerModule } from '@angular/material/divider';
import { BookService } from 'src/app/services/book.service';

@Component({
  selector: 'app-author-detail',
  templateUrl: './author-detail.component.html',
  styleUrls: ['./author-detail.component.css'],
  standalone: true,
  imports: [CommonModule, SpinnerComponent, MatDividerModule]
})
export class AuthorDetailComponent implements OnInit {
  author$: BehaviorSubject<Author> = new BehaviorSubject<Author>({} as Author); // Definirajte varijablu za pohranu autora
  hasLoaded: boolean = false
  constructor(private bookService: BookService, private route: ActivatedRoute, private authorService: AuthorService, private router: Router) { }

  books: Book[] = []

  ngOnInit(): void {
    const authorId: number = parseInt(this.route.snapshot.params["id"]); // Pretvorite ID autora u broj, ako je potrebno
    this.authorService.getAuthorById(authorId)
      .subscribe({
        next: (author) => {
          this.author$.next(author)
          this.hasLoaded = true
          this.books = author.books
        }
      })
  }

  goToBook(id: number) {
    this.bookService.goToBook(id)
  }

  goToAuthor(id: number) {
    this.authorService.goToAuthor(id)
  }
}

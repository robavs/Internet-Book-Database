import { Component, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { Book } from 'src/app/models';
import { MatDividerModule } from '@angular/material/divider';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { BookService } from 'src/app/services/book.service';
import { AuthorService } from 'src/app/services/author.service';

@Component({
  selector: 'app-genre-books-dialog',
  templateUrl: './genre-books-dialog.component.html',
  styleUrls: ['./genre-books-dialog.component.css'],
  standalone: true,
  imports: [MatButtonModule, MatDialogModule, CommonModule, MatDividerModule, MatChipsModule]
})
export class GenreBooksDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { genreName: string, genreBooks: Book[] },
    private bookService: BookService,
    private authorService: AuthorService) { }

  goToBook(id: number) {
    this.bookService.goToBook(id)
  }

  goToAuthor(id: number) {
    this.authorService.goToAuthor(id)
  }
}

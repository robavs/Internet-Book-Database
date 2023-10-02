import { Component, OnInit, ViewChild } from '@angular/core';
import { Genre } from 'src/app/models/Genre';
import { GenreService } from 'src/app/services/genre.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, Observable, filter, map, of } from 'rxjs';
import { GenreBooksDialogComponent } from 'src/app/shared-components/genre-books-dialog/genre-books-dialog.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Book } from 'src/app/models';
import { PaginatorComponent } from 'src/app/shared-components/paginator/paginator.component';
import { PageEvent } from '@angular/material/paginator';
import { SpinnerComponent } from 'src/app/shared-components/spinner/spinner.component';

@Component({
  selector: 'app-genres',
  templateUrl: './genres.component.html',
  styleUrls: ['./genres.component.css'],
  standalone: true,
  imports: [MatCardModule, MatDividerModule, MatButtonModule, MatProgressBarModule, CommonModule,
    MatButtonModule, MatDialogModule, GenreBooksDialogComponent, PaginatorComponent, SpinnerComponent
  ],
})

export class GenresComponent implements OnInit {
  genres$: BehaviorSubject<Genre[]> = new BehaviorSubject<Genre[]>([])
  genresForCurrentPage$: Observable<Genre[]> = of([])
  genreBooks: Book[] = []
  hasLoaded: number = 0

  constructor(
    private genreService: GenreService,
    public dialog: MatDialog
  ) { }

  openDialog(genreName: string, genreBooks: Book[]) {
    this.dialog.open(GenreBooksDialogComponent, {
      data: { genreName, genreBooks },
      autoFocus: false,
      maxHeight: "90vh",
      width: "600px"
    })
  }

  ngOnInit(): void {
    this.genreService.getBooks()
      .subscribe({
        next: (genres) => {
          this.genres$.next(genres)
          this.genresForCurrentPage$ = of(genres.slice(0, 5))
          this.hasLoaded = genres.length
        }
      })
  }

  onChangingPage(event: PageEvent) {
    const genresByPage: Genre[] = this.genres$.value.slice(
      event.pageIndex * event.pageSize, (event.pageIndex + 1) * event.pageSize
    )
    this.genresForCurrentPage$ = of(genresByPage)
  }
}

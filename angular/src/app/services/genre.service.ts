import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Genre } from '../models/Genre';

@Injectable({
  providedIn: 'root'
})
export class GenreService {

  constructor(private http: HttpClient) { }

  getBooks(): Observable<Genre[]> {
    return this.http.get<Genre[]>("http://localhost:3000/genre/getAllGenresWithBooksAndAuthors")
      .pipe();
  }
}

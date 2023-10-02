import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Author } from '../models/Author';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthorService {

  constructor(private http: HttpClient, private router: Router) { }

  getAuthors(): Observable<Author[]> {
    return this.http.get<Author[]>("http://localhost:3000/author/getAuthors")
      .pipe();
  }

  getAuthorById(id: number): Observable<Author> {
    return this.http.get<Author>("http://localhost:3000/author/get/" + `${id}`)
  }

  goToAuthor(authorId: number) {
    this.router.navigate(["r/authors", authorId]);
  }
}

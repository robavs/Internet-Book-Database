import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, tap, throwError } from 'rxjs';
import { Book } from '../models/Book';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  constructor(private http: HttpClient, private router: Router) { }

  getAll() {
    return this.http.get<Book[]>(environment.api + "/book/getAll")
  }

  getBookById(id: number): Observable<Book> {
    return this.http.get<Book>("http://localhost:3000/book/get/" + `${id}`)
  }

  goToBook(bookId: number) {
    this.router.navigate(["r/books", bookId]);
  }

  deleteBook(id: number) {
    try {
      const route = environment.api + "/book/delete/" + id
      return this.http.delete(route).pipe(
        catchError((error) => {
          throw new Error(error)
        })
      ).subscribe({ next: (value) => console.log(value) })
    }
    catch (err) {
      return err
    }
  }
}

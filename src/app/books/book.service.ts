import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})

export class BookService {
    private httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    private serverUrl = 'http://localhost:8000';

    constructor(private http: HttpClient) { }

    getBooks(filter: string): Observable<Object[]> {
        return this.http.get<Object[]>(`${this.serverUrl}/api/books/${filter}`)
        .pipe(
            tap(data => JSON.stringify(data)),
            catchError(this.handleError)
        );
    }

    getBook(isbn: number): Observable<Object> {
        return this.http.get<Object>(`${this.serverUrl}/api/book/${isbn}`)
        .pipe(
            tap(data => JSON.stringify(data)),
            catchError(this.handleError)
        )
    }

    private handleError(err: HttpErrorResponse) {
        let errorMessage = '';
        if (err.error instanceof ErrorEvent) {
          errorMessage = `An error occurred: ${err.error.message}`;
        } else {
          errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
        }
        console.error(errorMessage);
        return throwError(errorMessage);
    }
}
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})

export class BookService {
    private serverUrl = 'http://localhost:8000';

    constructor(private http: HttpClient) { }

    getBooks(filter: string): Observable<Object[]> {
        return this.http.get<Object[]>(`${this.serverUrl}/api/books/${filter}`)
        .pipe(
            catchError(this.handleError)
        );
    }

    getBook(isbn: number): Observable<Object> {
        return this.http.get<Object>(`${this.serverUrl}/api/book/${isbn}`)
        .pipe(
            catchError(this.handleError)
        )
    }

    private handleError(err: HttpErrorResponse) {
        let errorMessage = '';
        if (err.error instanceof ErrorEvent) {
          errorMessage = `An error occurred: ${err.error.message}`;
        } else if (err.status === 404){
          errorMessage = `Book not Found.`;
        } else {
            errorMessage = `Server returned error code: ${err.status} and error message: ${err.message}.`;
        }
        return throwError(errorMessage);
    }
}
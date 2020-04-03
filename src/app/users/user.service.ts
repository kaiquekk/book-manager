import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})

export class UserService {
    private serverUrl = 'http://localhost:8000';

    constructor(private http: HttpClient) { }

    getList(userId: number): Observable<Object[]> {
      return this.http.get<Object[]>(`${this.serverUrl}/api/users/${userId}/list`)
      .pipe(
        catchError(this.handleError)
      )
    }

    removeFromList(userId: number, isbn: number): Observable<Object> {
      return this.http.delete<Object>(`${this.serverUrl}/api/users/${userId}/list/${isbn}`)
      .pipe(
        catchError(this.handleError)
      )
    }

    addToList(userId: number, book: Object): Observable<Object> {
      return this.http.post<Object>(`${this.serverUrl}/api/users/${userId}/list`, book)
      .pipe(
        catchError(this.handleError)
      )
    }

    private handleError(err: HttpErrorResponse) {
        let errorMessage = '';
        if (err.statusText === 'Unknown Error') {
          errorMessage = 'Could not connect to the server.';
        } else {
          errorMessage = `${err.error.message}`;
        }
        return throwError(errorMessage);
    }
}
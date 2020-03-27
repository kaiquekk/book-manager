import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';

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
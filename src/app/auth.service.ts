import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private currentUserSubject: BehaviorSubject<Object>;
    public currentUser: Observable<Object>;

    constructor(private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<Object>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): Object {
        return this.currentUserSubject.value;
    }

    login(username: string, password: string) {
        return this.http.post<any>('http://localhost:8000/api/users/auth', { "username": username, "password": password })
            .pipe(
                map(user => {
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    this.currentUserSubject.next(user);
                    return user;
                }),
                catchError(this.handleError)
            );
    }

    register(firstName: string, lastName: string, username: string, password: string, age: number, email: string) {
        return this.http.post<any>('http://localhost:8000/api/users/register',
        { "firstName": firstName, "lastName": lastName, "username": username, "password": password, "age": age, "email": email })
            .pipe(
                catchError(this.handleError)
            )
    }

    logout() {
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
    }

    isLoggedIn(): boolean {
        if (localStorage.getItem('currentUser') === null) {
            return false;
        }
        else {
            return true;
        }
    }

    private handleError(err: HttpErrorResponse) {
        return throwError(err);
    }
}
import { Component } from '@angular/core';
import { BookService } from './book.service';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { UserService } from '../users/user.service';

@Component({
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.sass']
})

export class BookListComponent {
  books: Object[] = [];
  searchKey: string = '';
  errorMessage: string = '';
  showFilter: boolean = false;

  constructor(private bookService: BookService,
              private authService: AuthService,
              private userService: UserService) { }

  searchBooks(): void {
    this.bookService.getBooks(this.searchKey).subscribe({
      next: books => {
        this.books = books["books"];
        this.showFilter = true;
      },
      error: err => this.errorMessage = err
    });
  }

  isLogged(): boolean {
    return this.authService.isLoggedIn();
  }

  addToList(book: Object): void {
    this.userService.addToList(this.authService.currentUserValue["userId"], { "isbn": +book["isbn13"], "title": book["title"], "image": book["image"] }).subscribe({
      next: data => console.log('Book added'),
      error: err => this.errorMessage = err
    });
  }

}

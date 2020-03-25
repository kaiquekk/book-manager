import { Component } from '@angular/core';
import { BookService } from './book.service';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

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
              private router: Router) { }

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

  addBook() {
  }

}

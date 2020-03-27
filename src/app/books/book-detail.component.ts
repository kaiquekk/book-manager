import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BookService } from './book.service';
import { AuthService } from '../auth.service';
import { UserService } from '../users/user.service';

@Component({
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.sass']
})

export class BookDetailComponent implements OnInit {
  book: Object | undefined;
  errorMessage: string = '';

  constructor(private route: ActivatedRoute,
              private router: Router,
              private bookService: BookService,
              private authService: AuthService,
              private userService: UserService) {
  }

  ngOnInit(): void {
    const param = this.route.snapshot.paramMap.get('isbn');
    if (param) {
      const isbn = +param;
      this.getBook(isbn);
    }
  }

  isLogged(): boolean {
    return this.authService.isLoggedIn();
  }

  addToList() {
    this.userService.addToList(this.authService.currentUserValue["userId"], { "isbn": +this.book["isbn13"], "title": this.book["title"], "image": this.book["image"] }).subscribe({
      next: data => console.log('Book added to list'),
      error: err => this.errorMessage = err
    });
  }

  getBook(isbn: number): void {
    this.bookService.getBook(isbn).subscribe({
      next: book => this.book = book,
      error: err => this.errorMessage = err
    });
  }

  onBack(): void {
    this.router.navigate(['/books']);
  }
}

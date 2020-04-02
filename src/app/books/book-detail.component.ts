import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Data } from '@angular/router';
import { BookService } from './book.service';
import { AuthService } from '../auth.service';
import { UserService } from '../users/user.service';
import { AlertService } from '../alerts/alert.service';

@Component({
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.sass']
})

export class BookDetailComponent implements OnInit {
  book: Object | undefined;
  state: string = '';

  constructor(private route: ActivatedRoute,
              private router: Router,
              private bookService: BookService,
              private authService: AuthService,
              private userService: UserService,
              private alertService: AlertService) {
  }

  ngOnInit(): void {
    const param = this.route.snapshot.paramMap.get('isbn');
    if (this.route.snapshot.paramMap.get('search')) {
      this.state = this.route.snapshot.paramMap.get('search');
    }
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
      next: () => this.alertService.success(`${this.book["title"]} added to your List!`),
      error: err => this.alertService.error(err)
    });
  }

  getBook(isbn: number): void {
    this.bookService.getBook(isbn).subscribe({
      next: book => this.book = book,
      error: err => this.alertService.error(err)
    });
  }

  onBack(): void {
    if (this.state) {
      this.router.navigate(['/books', {search: this.state}]);
    }
    else {
      this.router.navigate(['/books']);
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { BookService } from './book.service';
import { AuthService } from '../auth.service';
import { UserService } from '../users/user.service';
import { AlertService } from '../alerts/alert.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.sass']
})

export class BookListComponent implements OnInit{
  books: Object[] | undefined;
  searchKey: string = '';
  showFilter: boolean = false;

  constructor(private bookService: BookService,
              private authService: AuthService,
              private userService: UserService,
              private alertService: AlertService,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    if (this.route.snapshot.paramMap.get('search')) {
      this.searchKey = this.route.snapshot.paramMap.get('search');
      this.searchBooks();
    }
  }
              
  searchBooks(): void {
    this.bookService.getBooks(this.searchKey).subscribe({
      next: books => {
        this.books = books["books"];
        this.showFilter = true;
        if (this.books.length <= 0) {
          this.books = undefined;
          this.alertService.warn(`Could not find any books for ${this.searchKey}. Please refine your filter.`);
        }
      },
      error: err => this.alertService.error(err)
    });
  }

  isLogged(): boolean {
    return this.authService.isLoggedIn();
  }

  addToList(book: Object): void {
    this.userService.addToList(this.authService.currentUserValue["userId"], { "isbn": +book["isbn13"], "title": book["title"], "image": book["image"] }).subscribe({
      next: () => this.alertService.success(`${book["title"]} added to your List!`),
      error: err => this.alertService.error(err)
    });
  }

}

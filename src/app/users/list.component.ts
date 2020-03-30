import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from './user.service';
import { AlertService } from '../alerts/alert.service';

@Component({
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.sass']
})
export class ListComponent implements OnInit {
  books: Object[] | undefined;
  userId: number;

  constructor(private authService: AuthService,
              private router: Router,
              private userService: UserService,
              private route: ActivatedRoute,
              private alertService: AlertService) 
  {     
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
    }
  }

  ngOnInit(): void {
    this.userId = +this.route.snapshot.paramMap.get('id');
    if (this.userId) {
      this.getList();
    }
  }

  getList(): void {
    this.userService.getList(this.userId).subscribe({
      next: books => this.books = books,
      error: err => this.alertService.error(err)
    });
  }

  removeBook(book: Object): void {
    this.userService.removeFromList(this.userId, book["isbn"]).subscribe({
      next: () => {
        this.getList();
        this.alertService.success(`${book["title"]} removed from your List!`);
      },
      error: err => this.alertService.error(err)
    });
  }
}

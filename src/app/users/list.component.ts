import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from './user.service';

@Component({
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.sass']
})
export class ListComponent implements OnInit {
  books: Object[] | undefined;
  userId: number;  
  errorMessage: string = '';

  constructor(private authService: AuthService,
              private router: Router,
              private userService: UserService,
              private route: ActivatedRoute) 
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
      error: err => this.errorMessage = err
    });
  }

  removeBook(isbn: number): void {
    this.userService.removeFromList(this.userId, isbn).subscribe({
      next: data => this.getList(),
      error: err => this.errorMessage = err
    });
  }
}

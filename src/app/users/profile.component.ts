import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.sass']
})
export class ProfileComponent implements OnInit {
  user: Object;

  constructor(private authService: AuthService,
              private router: Router) 
  {     
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
    }
  }

  ngOnInit(): void {
    this.user = this.authService.currentUserValue;
  }

  viewBooklist(): void {
    this.router.navigate(['/users', this.user["userId"],'list'])
  }

}

import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router, ActivatedRoute, RouterEvent } from '@angular/router';
import { AlertService } from '../alerts/alert.service';

@Component({
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.sass']
})
export class ProfileComponent implements OnInit {
  user: Object;
  userId: number;
  valid: boolean = true;

  constructor(private authService: AuthService,
              private router: Router,
              private route: ActivatedRoute,
              private alertService: AlertService) 
  {     
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
    }
  }
  

  ngOnInit(): void {
    this.userId = +this.route.snapshot.paramMap.get('id');
    this.user = this.authService.currentUserValue;
    if (this.userId !== this.user["userId"]) {
      this.valid = false;
      this.alertService.error('You don\'t have permission to access another user profile.');
    }
  }

  viewBooklist(): void {
    this.router.navigate(['/users', this.user["userId"],'list'])
  }

}

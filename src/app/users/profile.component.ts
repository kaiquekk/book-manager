import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService } from '../alerts/alert.service';

@Component({
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.sass']
})
export class ProfileComponent implements OnInit {
  user: Object;
  userId: number;
  allowed: boolean = true;

  constructor(private authService: AuthService,
              private router: Router,
              private route: ActivatedRoute,
              private alertService: AlertService) {}  

  ngOnInit(): void { 
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
    }
    this.userId = +this.route.snapshot.paramMap.get('id');
    this.user = this.authService.currentUserValue;
    if (this.userId !== this.user["userId"]) {
      this.allowed = false;
      this.alertService.error('You don\'t have permission to access another user profile.');
    }
  }

  viewBooklist(): void {
    this.router.navigate(['/users', this.user["userId"], 'list'])
  }

}

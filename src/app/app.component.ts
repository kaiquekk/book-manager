import { Component, Input } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { AlertService } from './alerts/alert.service';

@Component({
  selector: 'bm-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  pageTitle: string = 'Book Manager';

  constructor(private authService: AuthService, 
              private router: Router,
              private alertService: AlertService) { }

  isLogged() {
    return this.authService.isLoggedIn();
  }

  getId(): string {
    return this.authService.currentUserValue['userId'];
  }

  logout(): void {
    this.authService.logout();
    this.alertService.info('Successfully logged out.', true);
    this.router.navigate(['/login']);    
  }
}

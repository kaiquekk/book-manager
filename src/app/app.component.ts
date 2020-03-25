import { Component, Input } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'bm-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  pageTitle: string = 'Book Manager';

  constructor(private authService: AuthService, private router: Router) { }

  isLogged() {
    return this.authService.isLoggedIn();
  }

  getId(): string {
    return this.authService.currentUserValue['userId'];
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.sass']
})
export class ListComponent implements OnInit {

  constructor(private authService: AuthService,
              private router: Router) 
  {     
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
    }
  }

  ngOnInit(): void {
  }

}

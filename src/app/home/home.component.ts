import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.sass']
})

export class HomeComponent implements OnInit{
    user: Object;
    constructor(private authService: AuthService) { }

    ngOnInit() {
        this.user = this.authService.currentUserValue;
    }

}

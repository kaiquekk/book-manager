import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService } from '../alerts/alert.service';

@Component({
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.sass']
})

export class LoginComponent implements OnInit {
    submitted: boolean = false;
    loginForm: FormGroup;

    constructor(private router: Router,
                private authService: AuthService,
                private formBuilder: FormBuilder,
                private alertService: AlertService)
    {
        if (this.authService.currentUserValue) {
            this.router.navigate(['/home']);
        }
    }

    ngOnInit() {
        this.loginForm = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });
    }

    get f() {
        return this.loginForm.controls;
    }

    onSubmit() {
        this.submitted = true;
        if (this.loginForm.invalid) {
            return;
        }
        this.authService.login(this.f.username.value, this.f.password.value)
            .pipe(first())
            .subscribe(
                () => {
                    this.alertService.info('Successfully logged in.', true);
                    this.router.navigate(['/home']);
                },
                err => this.alertService.error(err.error.message)
            )       
    }
}
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

@Component({
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.sass']
})

export class RegisterComponent implements OnInit {
    submitted: boolean = false;
    loading: boolean = false;
    registerForm: FormGroup;
    errorMessage: string = '';

    constructor(private router: Router,
                private authService: AuthService,
                private formBuilder: FormBuilder
    ) {
        if (this.authService.currentUserValue) {
            this.router.navigate(['/home']);
        }
    }

    ngOnInit() {
        this.registerForm = this.formBuilder.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            username: ['', Validators.required],
            password: ['', Validators.required]
        });
    }

    get f() {
        return this.registerForm.controls;
    }

    onSubmit() {
        this.submitted = true;
        if (this.registerForm.invalid) {
            return;
        }
        this.loading = true;

        this.authService.register(this.f.firstName.value, this.f.lastName.value, 
            this.f.username.value, this.f.password.value)
            .pipe(first())
            .subscribe(
                data => {
                    this.router.navigate(['/login']);
                },
                error => {
                    this.errorMessage = error;
                    this.loading = false;
                }
            )       
    }
}
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService } from '../alerts/alert.service';

@Component({
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.sass']
})

export class RegisterComponent implements OnInit {
    submitted: boolean = false;
    registerForm: FormGroup;
    errorMessage: string = '';

    constructor(private router: Router,
                private authService: AuthService,
                private formBuilder: FormBuilder,
                private alertService: AlertService) {}

    ngOnInit() {        
        if (this.authService.currentUserValue) {
            this.router.navigate(['/home']);
        }
        this.registerForm = this.formBuilder.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],            
            age: ['', Validators.pattern('\\d+')],
            email: ['', Validators.email],
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
        this.authService.register(this.f.firstName.value, this.f.lastName.value, 
            this.f.username.value, this.f.password.value, +this.f.age.value, this.f.email.value)
            .pipe(first())
            .subscribe(
                () => {
                    this.alertService.info('Successfully created new user. Please login.', true);
                    this.router.navigate(['/login']);
                },
                err => this.alertService.error(err.error.message)
            )       
    }
}
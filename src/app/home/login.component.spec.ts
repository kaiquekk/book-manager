import { async, TestBed } from '@angular/core/testing';
import { AuthService } from '../auth.service';
import { LoginComponent } from './login.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

describe('LoginComponent', () => {
    let mockAuthService;

    beforeEach(async(() => {
        mockAuthService = jasmine.createSpyObj('mockAuthService', ['isLoggedIn', 'login'], {['currentUserValue']: {"userId": '123'}});

        TestBed.configureTestingModule({
            declarations: [ LoginComponent ],
            providers: [
                { provide: AuthService, useValue: mockAuthService },
                FormBuilder
            ],
            imports: [RouterTestingModule.withRoutes([])],
            schemas: [NO_ERRORS_SCHEMA]
        })
    }));

    function setup(logged: boolean) {
        const fixture = TestBed.createComponent(LoginComponent);
        const login = fixture.debugElement.componentInstance;
        const navSpy = spyOn(TestBed.get(Router), 'navigate');
        mockAuthService.isLoggedIn.and.returnValue(logged);
        return { fixture, login, navSpy };
    };

    it('should create the login component', async(() => {
        const { login } = setup(false);
        expect(login).toBeTruthy();
    }));

    it('should redirect if logged', async(() => {
        const { fixture, navSpy } = setup(true);
        fixture.detectChanges();
        expect(navSpy).toHaveBeenCalledWith(['/home']);
    }));

    it('should call login', async(() => {
        const { fixture, login, navSpy } = setup(false);
        mockAuthService.login.and.returnValue(of(true));        
        fixture.detectChanges();
        login.loginForm.controls['username'].setValue('test');
        login.loginForm.controls['password'].setValue('test');        
        expect(login.loginForm.valid).toBe(true)
        login.onSubmit();
        expect(login.submitted).toBe(true);
        expect(mockAuthService.login).toHaveBeenCalledWith('test', 'test');
        expect(navSpy).toHaveBeenCalledWith(['/home']);
    }));

})

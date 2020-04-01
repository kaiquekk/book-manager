import { async, TestBed } from '@angular/core/testing';
import { AuthService } from '../auth.service';
import { RegisterComponent } from './register.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

describe('RegisterComponent', () => {
    let mockAuthService;

    beforeEach(async(() => {
        mockAuthService = jasmine.createSpyObj('mockAuthService', ['isLoggedIn', 'register'], {['currentUserValue']: {"userId": '123'}});

        TestBed.configureTestingModule({
            declarations: [ RegisterComponent ],
            providers: [
                { provide: AuthService, useValue: mockAuthService },
                FormBuilder
            ],
            imports: [RouterTestingModule.withRoutes([])],
            schemas: [NO_ERRORS_SCHEMA]
        })
    }));

    function setup(logged: boolean) {
        const fixture = TestBed.createComponent(RegisterComponent);
        const register = fixture.debugElement.componentInstance;
        const navSpy = spyOn(TestBed.get(Router), 'navigate');
        mockAuthService.isLoggedIn.and.returnValue(logged);
        return { fixture, register, navSpy };
    };

    it('should create the register component', async(() => {
        const { register } = setup(false);
        expect(register).toBeTruthy();
    }));

    it('should redirect if logged', async(() => {
        const { fixture, navSpy } = setup(true);
        fixture.detectChanges();
        expect(navSpy).toHaveBeenCalledWith(['/home']);
    }));

    it('should call register', async(() => {
        const { fixture, register, navSpy } = setup(false);
        mockAuthService.register.and.returnValue(of(true));        
        fixture.detectChanges();
        register.registerForm.controls['username'].setValue('test');
        register.registerForm.controls['password'].setValue('test');      
        register.registerForm.controls['age'].setValue(1); 
        register.registerForm.controls['email'].setValue('a@m.com');
        register.registerForm.controls['firstName'].setValue('test');   
        register.registerForm.controls['lastName'].setValue('test');      
        expect(register.registerForm.valid).toBe(true)
        register.onSubmit();
        expect(register.submitted).toBe(true);
        expect(mockAuthService.register).toHaveBeenCalledWith('test', 'test', 'test', 'test', 1, 'a@m.com');
        expect(navSpy).toHaveBeenCalledWith(['/login']);
    }));

})
import { async, TestBed } from '@angular/core/testing';
import { AuthService } from '../auth.service';
import { ProfileComponent } from './profile.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { LoginComponent } from '../home/login.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ListComponent } from './list.component';

describe('ProfileComponent', () => {
  let mockAuthService;

  beforeEach(async(() => {
    mockAuthService = jasmine.createSpyObj('mockAuthService', ['isLoggedIn'], {['currentUserValue']: {"userId": 123, "firstName": 'test'}})
    TestBed.configureTestingModule({
      declarations: [ ProfileComponent ],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => 123 } } } }
      ],
      imports: [RouterTestingModule.withRoutes([])],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  function setup(logged: boolean) {
    const fixture = TestBed.createComponent(ProfileComponent);
    const profile = fixture.debugElement.componentInstance;
    mockAuthService.isLoggedIn.and.returnValue(logged);
    const navSpy = spyOn(TestBed.get(Router), 'navigate');
    return { fixture, profile, navSpy };
  }

  it('should create the profile component', async(() => {
    const { profile } = setup(true);
    expect(profile).toBeTruthy();
  }));

  it('should set the user object correctly', async(() => {
    const { fixture, profile } = setup(true);
    fixture.detectChanges();
    expect(profile.userId).toEqual(123);
    expect(profile.user).toEqual({"userId": 123, "firstName": 'test'});
    expect(profile.allowed).toBe(true);
  }));

  it('should redirect if not logged', async(() => {
    const { fixture, navSpy } = setup(false);
    fixture.detectChanges();
    expect(navSpy).toHaveBeenCalledWith(['/login']);
  }));

  it('should go to book list', async(() => {
    const { fixture, profile, navSpy } = setup(true);
    fixture.detectChanges();
    profile.viewBooklist();
    expect(navSpy).toHaveBeenCalledWith(['/users', 123, 'list']);
  }));

});

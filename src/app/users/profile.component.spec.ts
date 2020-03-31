import { async, TestBed } from '@angular/core/testing';
import { AuthService } from '../auth.service';
import { ProfileComponent } from './profile.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { LoginComponent } from '../home/login.component';
import { ActivatedRoute } from '@angular/router';
import { ListComponent } from './list.component';

describe('ProfileComponent', () => {
  let mockAuthService;

  beforeEach(async(() => {
    mockAuthService = jasmine.createSpyObj(['isLoggedIn'], {['currentUserValue']: {"userId": '123'}})
    TestBed.configureTestingModule({
      declarations: [ ProfileComponent ],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => 123 } } } }
      ],
      imports: [RouterTestingModule.withRoutes([
        { path: 'login', component: LoginComponent },
        { path: 'users/123/list', component: ListComponent }
      ])],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  function setup() {
    const fixture = TestBed.createComponent(ProfileComponent);
    const profile = fixture.debugElement.componentInstance;
    mockAuthService.isLoggedIn.and.returnValue(false);
    return { fixture, profile };
  }

  it('should create the profile', async(() => {
    const { profile } = setup();
    expect(profile).toBeTruthy();
  }));

  it('should set the user object correctly', async(() => {
    const { fixture } = setup();
    fixture.detectChanges();
    expect(fixture.componentInstance.userId).toEqual(123)
    expect(fixture.componentInstance.user["userId"]).toEqual('123')
  }))


});

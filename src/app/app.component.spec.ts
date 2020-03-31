import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from './auth.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('AppComponent', () => {
  let mockAuthService;
  beforeEach(async(() => {
    mockAuthService = jasmine.createSpyObj(['isLoggedIn', 'logout'], {['currentUserValue']: {"userId": '123'}});
    
    TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
      imports: [
        RouterTestingModule
      ],
      providers: [
        { provide: AuthService, useValue: mockAuthService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  function setup() {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    return { fixture, app };
  }

  it('should create the app', async(() => {
    const { app } = setup();
    expect(app).toBeTruthy();
  }));

  it('should have \'Book Manager\' as page title', async(() => {
    const { app } = setup();
    expect(app.pageTitle).toBe('Book Manager');
  }));

  it('should call isLogged function', async(() => {
    const { app } = setup();
    mockAuthService.isLoggedIn.and.returnValue(false);
    expect(app.isLogged()).toBe(false);
  }));

  it('should call getId function', async(() => {
    const { app } = setup();
    expect(app.getId()).toEqual('123');;
  }));

  // it('should test logout', async(() => {
  //   TODO
  // }))

});

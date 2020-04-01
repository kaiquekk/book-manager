import { TestBed, async } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { AuthService } from '../auth.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('HomeComponent', () => {
    let mockAuthService;
    beforeEach(async(() => {
        mockAuthService = jasmine.createSpyObj('mockAuthService', [], {['currentUserValue']: {"userId": '123'}});

        TestBed.configureTestingModule({
            declarations: [
                HomeComponent
            ],
            providers: [
                { provide: AuthService, useValue: mockAuthService }
            ],
            schemas: [NO_ERRORS_SCHEMA]
        })
    }));
    
  function setup() {
    const fixture = TestBed.createComponent(HomeComponent);
    const home = fixture.debugElement.componentInstance;
    return { fixture, home };
  }

  it('should create the home component', async(() => {
    const { home } = setup();
    expect(home).toBeTruthy();
  }));

  it('should set the current user value', async(() => {
    const { fixture, home } = setup();
    fixture.detectChanges();
    expect(home.user["userId"]).toEqual('123');
  }));
})
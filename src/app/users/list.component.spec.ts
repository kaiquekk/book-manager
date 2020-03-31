import { async, TestBed } from '@angular/core/testing';
import { AuthService } from '../auth.service';
import { UserService } from './user.service';
import { ListComponent } from './list.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { LoginComponent } from '../home/login.component';
import { of } from 'rxjs';

describe('ListComponent', () => {
  let mockAuthService;
  let mockUserService;

  beforeEach(async(() => {
    mockAuthService = jasmine.createSpyObj(['isLoggedIn']);
    mockUserService = jasmine.createSpyObj(['getList', 'removeFromList']);
    TestBed.configureTestingModule({
      declarations: [ ListComponent ],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: UserService, useValue: mockUserService },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => 123 } } } }
      ],
      imports: [RouterTestingModule.withRoutes([
        { path: 'login', component: LoginComponent }
      ])],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  function setup() {
    const fixture = TestBed.createComponent(ListComponent);
    mockAuthService.isLoggedIn.and.returnValue(false);
    const list = fixture.debugElement.componentInstance;
    return { fixture, list };
  }

  it('should create the list', () => {
    const { list } = setup();
    expect(list).toBeTruthy();
  });

  it('should set the userid and books array correctly', async(() => {
    const { fixture } = setup(); 
    mockUserService.getList.and.returnValue(of([{"isbn": 1, "title": 'book'}]));   
    fixture.detectChanges();
    expect(fixture.componentInstance.userId).toEqual(123);
    expect(fixture.componentInstance.books[0]["isbn"]).toEqual(1);
    expect(fixture.componentInstance.books[0]["title"]).toEqual('book');
  }))

  it('should call removebook', async(() => {
    const { fixture } = setup();
    mockUserService.removeFromList.and.returnValue(of({}));
    mockUserService.getList.and.returnValue(of([{"isbn": 2, "title": 'book'}]));  
    fixture.detectChanges();
    expect(fixture.componentInstance.books[0]["isbn"]).toEqual(2);
    expect(fixture.componentInstance.books[0]["title"]).toEqual('book');
  }))

});

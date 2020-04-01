import { async, TestBed } from '@angular/core/testing';
import { AuthService } from '../auth.service';
import { UserService } from './user.service';
import { ListComponent } from './list.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';

describe('ListComponent', () => {
  let mockAuthService;
  let mockUserService;

  beforeEach(async(() => {
    mockAuthService = jasmine.createSpyObj('mockAuthService', ['isLoggedIn']);
    mockUserService = jasmine.createSpyObj('mockUserService', ['getList', 'removeFromList']);
    TestBed.configureTestingModule({
      declarations: [ ListComponent ],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: UserService, useValue: mockUserService },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => 123 } } } }
      ],
      imports: [RouterTestingModule.withRoutes([])],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  function setup(logged: boolean) {
    const fixture = TestBed.createComponent(ListComponent);
    const list = fixture.debugElement.componentInstance;
    const navSpy = spyOn(TestBed.get(Router), 'navigate');
    mockAuthService.isLoggedIn.and.returnValue(logged);
    return { fixture, list, navSpy };
  }

  it('should create the list component', () => {
    const { list } = setup(true);
    expect(list).toBeTruthy();
  });

  it('should set the userid and books array correctly', async(() => {
    const { fixture, list } = setup(true);
    mockUserService.getList.and.returnValue(of([{"isbn": 321, "title": 'book'}]));   
    fixture.detectChanges();
    expect(list.userId).toEqual(123);
    expect(list.books).toEqual([{"isbn": 321, "title": 'book'}]);
  }))

  it('should call removeBook', async(() => {
    const { fixture, list } = setup(true);
    mockUserService.removeFromList.and.returnValue(of({}));
    mockUserService.getList.and.returnValue(of([{"isbn": 2, "title": 'book'}])); 
    list.userId = 123;
    list.removeBook({"isbn": 1, "title": 'remove'});
    fixture.detectChanges();
    expect(list.books).toEqual([{"isbn": 2, "title": 'book'}]);
    expect(mockUserService.removeFromList).toHaveBeenCalledWith(123, 1);
  }));

  it('should redirect if not logged', async(() => {
    const { fixture, navSpy } = setup(false);
    mockUserService.getList.and.returnValue(of([{}]))
    fixture.detectChanges();
    expect(navSpy).toHaveBeenCalledWith(['/login']);
  }));

});

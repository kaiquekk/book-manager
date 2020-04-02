import { async, TestBed } from '@angular/core/testing';
import { AuthService } from '../auth.service';
import { BookDetailComponent } from './book-detail.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { UserService } from '../users/user.service';
import { BookService } from './book.service';
import { of } from 'rxjs';

describe('BookDetailComponent', () => {
  let mockAuthService;
  let mockUserService;
  let mockBookService;

  beforeEach(async(() => {
    mockAuthService = jasmine.createSpyObj('mockAuthService', ['isLoggedIn'], {['currentUserValue']: {"userId": '123'}});
    mockUserService = jasmine.createSpyObj('mockUserService', ['addToList']);
    mockBookService = jasmine.createSpyObj('mockBookService', ['getBook']);
    
    TestBed.configureTestingModule({
      declarations: [ BookDetailComponent ],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: UserService, useValue: mockUserService },
        { provide: BookService, useValue: mockBookService },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => 321 } } } }
      ],
      imports: [RouterTestingModule.withRoutes([])],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  function setup() {
    const fixture = TestBed.createComponent(BookDetailComponent);
    const detail = fixture.debugElement.componentInstance;
    const navSpy = spyOn(TestBed.get(Router), 'navigate');
    return { fixture, detail, navSpy };
  };

  it('should create the book detail component', () => {
    const { detail } = setup();
    expect(detail).toBeTruthy();
  });

  it('should set the book detail correctly', async(() => {
    const { fixture, detail } = setup();
    mockBookService.getBook.and.returnValue(of({"isbn13": 321, "title": 'book'}))
    fixture.detectChanges();
    expect(detail.book).toEqual({"isbn13": 321, "title": 'book'});
  }));

  it('should check if user is logged', async(() => {
    const { detail } = setup();
    mockAuthService.isLoggedIn.and.returnValue(true);
    expect(detail.isLogged()).toBe(true);
  }));

  it('should call addToList', async(() => {
    const { detail } = setup();
    detail.book = {"isbn13": 321, "title": 'book'};
    mockUserService.addToList.and.returnValue(of({}));
    detail.addToList();
    expect(mockUserService.addToList).toHaveBeenCalledWith('123', {"isbn": 321, "title": 'book', "image": undefined});
  }));

  it('should go back to book list', async(() => {
    const { detail, navSpy } = setup();
    detail.onBack();
    expect(navSpy).toHaveBeenCalledWith(['/books']);
  }));

  it('should go back to book list passing the search key', async(() => {
    const { detail, navSpy } = setup();
    detail.state = 'test';
    detail.onBack();
    expect(navSpy).toHaveBeenCalledWith(['/books', { search: 'test' }]);
  }));

});

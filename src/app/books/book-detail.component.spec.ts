import { async, TestBed } from '@angular/core/testing';
import { AuthService } from '../auth.service';
import { BookDetailComponent } from './book-detail.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { UserService } from '../users/user.service';
import { BookService } from './book.service';
import { BookListComponent } from './book-list.component';
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
      imports: [RouterTestingModule.withRoutes([
        { path: 'books', component: BookListComponent }
      ])],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  function setup() {
    const fixture = TestBed.createComponent(BookDetailComponent);
    const detail = fixture.debugElement.componentInstance;
    return { fixture, detail };
  }

  it('should create', () => {
    const { detail } = setup();
    expect(detail).toBeTruthy();
  });

  it('should set the book detail correctly', async(() => {
    const { fixture } = setup();
    mockBookService.getBook.and.returnValue(of({"isbn13": 321, "title": 'book'}))
    fixture.detectChanges();
    expect(fixture.componentInstance.book["isbn13"]).toEqual(321);
    expect(fixture.componentInstance.book["title"]).toEqual('book');
  }))

  it('should check if user is logged', async(() => {
    const { detail } = setup();
    mockAuthService.isLoggedIn.and.returnValue(true);
    expect(detail.isLogged()).toBe(true);
  }))

  it('should call addToList', async(() => {
    const { fixture, detail } = setup();
    fixture.componentInstance.book = {"isbn13": 321, "title": 'book'};
    mockUserService.addToList.and.returnValue(of({}));
    detail.addToList();
    expect(mockUserService.addToList).toHaveBeenCalledWith('123', jasmine.any(Object));
  }));
});

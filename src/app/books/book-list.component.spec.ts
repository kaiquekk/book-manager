import { async, TestBed } from '@angular/core/testing';
import { BookListComponent } from './book-list.component';
import { AuthService } from '../auth.service';
import { BookDetailComponent } from './book-detail.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { UserService } from '../users/user.service';
import { BookService } from './book.service';
import { of } from 'rxjs';

describe('BookListComponent', () => {  
  let mockAuthService;
  let mockUserService;
  let mockBookService;

  beforeEach(async(() => {
    mockAuthService = jasmine.createSpyObj('mockAuthService', ['isLoggedIn'], {['currentUserValue']: {"userId": '123'}});
    mockUserService = jasmine.createSpyObj('mockUserService', ['addToList']);
    mockBookService = jasmine.createSpyObj('mockBookService', ['getBooks']);   
    TestBed.configureTestingModule({
      declarations: [ BookListComponent ],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: UserService, useValue: mockUserService },
        { provide: BookService, useValue: mockBookService }
      ],
      imports: [RouterTestingModule],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  function setup() {
    const fixture = TestBed.createComponent(BookListComponent);
    const list = fixture.debugElement.componentInstance;
    
    fixture.componentInstance.books = []
    return { fixture, list };
  }

  it('should create', () => {
    const { list } = setup()
    expect(list).toBeTruthy();
  });

  it('should check if user is logged', async(() => {
    const { list } = setup();
    mockAuthService.isLoggedIn.and.returnValue(true);
    expect(list.isLogged()).toBe(true);
  }));

  it('should call addToList', async(() => {
    const { list } = setup();
    mockUserService.addToList.and.returnValue(of({}));
    list.addToList({"isbn13": 321, "title": 'book'});
    expect(mockUserService.addToList).toHaveBeenCalledWith('123', jasmine.any(Object));  
  }));

  it('should get and set the book list', async(() => {
    const { fixture, list } = setup();
    fixture.componentInstance.searchKey = 'test';
    mockBookService.getBooks.and.returnValue(of({"books":[{"isbn": 321, "title": 'book'}]})); 
    list.searchBooks();    
    fixture.detectChanges();
    expect(fixture.componentInstance.books).toEqual([{"isbn": 321, "title": 'book'}]);    
    expect(fixture.componentInstance.showFilter).toBe(true);
  }));
});

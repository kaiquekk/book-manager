import { TestBed, async } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from './user.service';
import { HttpErrorResponse, HttpRequest } from '@angular/common/http';

describe('UserService', () => {
  let userService: UserService;
  let httpMock: HttpTestingController;  

  beforeEach(() => {
    TestBed.configureTestingModule({
        imports: [
            HttpClientTestingModule
        ],
      providers: [UserService]
    });
    userService = TestBed.get(UserService);
    httpMock = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
      httpMock.verify();
  });

  it('should create user service', async(() => {
    expect(userService).toBeTruthy();
  }));
  
  describe('getList()', () => {
    const lists = [{
      "books": [
        { "isbn": 1, "title": "b1", "image": "img" },
        { "isbn": 2, "title": "b2", "image": "img" }
      ]
    }];

    it('should return the user\'s book list', async(() => {   
      userService.getList(123).subscribe(
        list => {
          expect(list[0]["books"].length).toBe(2);
          expect(list).toEqual(lists);
        }, 
        () => fail('should have succeeded')
      );
      const req = httpMock.expectOne('http://localhost:8000/api/users/123/list');  
      expect(req.request.method).toBe('GET');
      req.flush(lists, { status: 200, statusText: 'OK' });     
    }));

    it('should return \'user not found\' error', async(() => {
      userService.getList(123).subscribe(
        () => fail('should have returned an error'),
        err => expect(err).toEqual('User not found.')        
      );
      const req = httpMock.expectOne('http://localhost:8000/api/users/123/list');
      expect(req.request.method).toBe('GET');
      req.flush({message: 'User not found.'}, { status: 404, statusText: 'Not Found' });
    }));

  });

  describe('addToList()', () => {

    it('should add the book to the list', async(() => {
      const newBook = { "isbn": 123, "title": "test", "image": "img" },
        list = [{ "isbn": 100, "title": 'book', "image": 'img' },
        { "isbn": 123, "title": 'test', "image": 'img' }]

      userService.addToList(123, newBook).subscribe(
        response => expect(response).toEqual(list),
        () => fail('should have succeeded')
      );
      const req = httpMock.expectOne((request: HttpRequest<any>) => {
        return request.method == 'POST'
        && request.url == 'http://localhost:8000/api/users/123/list'
        && JSON.stringify(request.body) == JSON.stringify(newBook)   
      });
      req.flush(list, { status: 201, statusText: 'Created' });  
    }));

    it('should not add a book already in the list', async(() => {
      const book = { "isbn": 321, "title": 'book' }

      userService.addToList(123, book).subscribe(
        () => fail('should have returned an error'),
        err => expect(err).toEqual('book is already in your List.')
      );
      const req = httpMock.expectOne((request: HttpRequest<any>) => {
        return request.method == 'POST'
        && request.url == 'http://localhost:8000/api/users/123/list'
        && JSON.stringify(request.body) == JSON.stringify(book)
      });
      req.flush({message: 'book is already in your List.'}, { status: 400, statusText: 'Bad Request' });
    }));

  });

  describe('removeFromList()', () => {

    it('should remove the book from the list', async(() => {
      userService.removeFromList(123, 1).subscribe(
        response => expect(response).toEqual(''),
        () => fail('should have succeeded')
      );
      const req = httpMock.expectOne('http://localhost:8000/api/users/123/list/1');  
      expect(req.request.method).toBe('DELETE');
      req.flush('', { status: 200, statusText: 'OK' });  
    }));

  });

});

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
        {
          "isbn": 1,
          "title": "b1",
          "image": "img"
        },
        {
          "isbn": 2,
          "title": "b2",
          "image": "img"
        }
      ]
    }];

    it('should return the user\'s book list', () => {   
      userService.getList(123).subscribe(list => {
        expect(list[0]["books"].length).toBe(2);
        expect(list).toEqual(lists);
      });
      const req = httpMock.expectOne('http://localhost:8000/api/users/123/list');  
      expect(req.request.method).toBe('GET');
      req.flush(lists);     
    });

    // it('should return \'user not found\' error', () => {
    //   let error: any;
    //   userService.getList(123).subscribe(() =>
    //     fail('should have failed with 404 error'),
    //     err => {
    //       console.log(err)
    //       error = err;
    //     }
    //   );
    //   const req = httpMock.expectOne('http://localhost:8000/api/users/123/list');
    //   const a = new Error()
    //   expect(req.request.method).toBe('GET');
    //   req.flush(a)
    //   //req.flush('User not found.', { status: 404, statusText: 'Not Found' });
    //  // expect(error.status).toEqual(404);
    // })
  });

  describe('addToList()', () => {
    it('should add the book to the list', async(() => {
      const newBook = {
        "isbn": 123,
        "title": "test",
        "image": "img"
      },
        list = [
        {
          "isbn": 100,
          "title": 'book',
          "image": 'img'
        },
        {
          "isbn": 123,
          "title": 'test',
          "image": 'img'
        }
      ]
      userService.addToList(123, newBook).subscribe(response => {
        expect(response).toEqual(list);    
      })
      const req = httpMock.expectOne((request: HttpRequest<any>) => {
        return request.method == 'POST'
        && request.url == 'http://localhost:8000/api/users/123/list'
        && JSON.stringify(request.body) == JSON.stringify(newBook)   
      })
      req.flush(list);  
    }));
  });

  describe('removeFromList()', () => {
    it('should remove the book from the list', async(() => {
      userService.removeFromList(123, 1).subscribe(response => {
        expect(response).toEqual({});
      })
      const req = httpMock.expectOne('http://localhost:8000/api/users/123/list/1');  
      expect(req.request.method).toBe('DELETE');
      req.flush({});  
    }));
  });

});

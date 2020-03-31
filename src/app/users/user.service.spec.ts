import { TestBed } from '@angular/core/testing';
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
  })
  it('should be created', () => {
    expect(userService).toBeTruthy();
  });
  
  describe('getList()', () => {
    const lists = [{
      "books": [
        {
          "isbn": 9780596527747,
          "title": "Head First JavaScript",
          "image": "https://itbook.store/img/books/9780596527747.png"
        },
        {
          "isbn": 9781934356593,
          "title": "Seven Languages in Seven Weeks",
          "image": "https://itbook.store/img/books/9781934356593.png"
        }
      ]
    }];

    it('should return the user\'s book list', () => {   
      userService.getList(311982625).subscribe(list => {
        expect(list[0]["books"].length).toBe(2);
        expect(list).toEqual(lists);
      });
      const req = httpMock.expectOne('http://localhost:8000/api/users/311982625/list');  
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

    it('should add the book to the list', () => {
      const newBook = {
        "isbn": 123,
        "title": "Test",
        "image": "img"
      };
      const updatedList = Object.assign({}, lists);
      updatedList[0]["books"].push(newBook);
      userService.addToList(311982625, newBook).subscribe(response => {
        expect(response).toEqual(updatedList);      
      })
      const req = httpMock.expectOne((request: HttpRequest<any>) => {
        return request.method == 'POST'
        && request.url == 'http://localhost:8000/api/users/311982625/list'
        && JSON.stringify(request.body) == JSON.stringify(newBook)   
      })
      req.flush(updatedList);        
  });
})
});
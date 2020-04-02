import { TestBed, async } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BookService } from './book.service';

describe('BookService', () => {
    let bookService: BookService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [BookService]
        });
        bookService = TestBed.get(BookService);
        httpMock = TestBed.get(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should create book service', async(() => {
        expect(bookService).toBeTruthy();
    }));

    describe('getBooks()', () => {

        it('should return the list of books from search key', async(() => {
            const list = {
                "books": [
                    { "isbn": 321, "title": 'book', "image": 'img' }
                ]
            };

            bookService.getBooks('book').subscribe(
                list => {
                    expect(list["books"].length).toBe(1);
                    expect(list).toEqual({ "books": [{ "isbn": 321, "title": 'book', "image": 'img' }] });
                },
                () => fail('should have succeeded')
            );
            const req = httpMock.expectOne('http://localhost:8000/api/books/book');
            expect(req.request.method).toBe('GET');
            req.flush(list, { status: 200, statusText: 'OK' });
        }));        

    });

    describe('getBook()', () => {

        it('should return the book from the isbn', async(() => {
            const book = { "isbn": 321, "title": 'book', "image": 'img' };

            bookService.getBook(321).subscribe(
                book => {
                    expect(book["isbn"]).toEqual(321);
                    expect(book["title"]).toEqual('book');
                    expect(book["image"]).toEqual('img');
                },
                () =>  fail('should habe succeeded')
            );
            const req = httpMock.expectOne('http://localhost:8000/api/book/321');
            expect(req.request.method).toBe('GET');
            req.flush(book, { status: 200, statusText: 'OK' });
        }));

        it('should not return a book for invalid isbn', async(() => {
            bookService.getBook(1).subscribe(
                () => fail('should jave returned an error'),
                err => expect(err).toEqual('Book not Found.')
            );
            const req = httpMock.expectOne('http://localhost:8000/api/book/1');
            expect(req.request.method).toBe('GET');
            req.flush('Book not Found.', { status: 404, statusText: 'Not Found' });
        }));

    });

});
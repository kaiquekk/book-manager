import { TestBed, async } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { HttpRequest, HttpResponse } from '@angular/common/http';

describe('AuthService', () => {
    let authService: AuthService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [AuthService]
        });
        authService = TestBed.get(AuthService);
        httpMock = TestBed.get(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should create auth service', async(() => {
        expect(authService).toBeTruthy();
    }));

    describe('login()', () => {

        it('should request login', async(() => {
            const user = { "username": 'user', "password": '123' };

            authService.login('user', '123').subscribe(
                user => {
                    expect(user["username"]).toEqual('user');
                    expect(user["password"]).toEqual('123');
                },
                () => fail('should have succeeded')
            );
            const req = httpMock.expectOne((request: HttpRequest<any>) => {
                return request.method == 'POST'
                && request.url == 'http://localhost:8000/api/users/auth'
                && JSON.stringify(request.body) == JSON.stringify(user)
            });
            req.flush(user, { status: 200, statusText: 'OK' });
        }));

        it('should return invalid password', async(() => {
            const user = { "username": 'user', "password": '12' };

            authService.login('user', '12').subscribe(
                () => fail('should have returned an error'),
                err => expect(err.error).toEqual('Invalid Password.')
            );
            const req = httpMock.expectOne((request: HttpRequest<any>) => {
                return request.method == 'POST'
                && request.url == 'http://localhost:8000/api/users/auth'
                && JSON.stringify(request.body) == JSON.stringify(user)
            });
            req.flush('Invalid Password.', { status: 400, statusText: 'Bad Request' });
        }));

        
        it('should return invalid username', async(() => {
            const user = { "username": 'u', "password": '123' };

            authService.login('u', '123').subscribe(
                () => fail('should have returned an error'),
                err => expect(err.error).toEqual('Username doesn\'t exist.')
            );
            const req = httpMock.expectOne((request: HttpRequest<any>) => {
                return request.method == 'POST'
                && request.url == 'http://localhost:8000/api/users/auth'
                && JSON.stringify(request.body) == JSON.stringify(user)
            });
            req.flush('Username doesn\'t exist.', { status: 400, statusText: 'Bad Request' });
        }));

    });

    describe('register()', () => {

        const user = {
            "firstName": 'fname',
            "lastName": 'lname',
            "username": 'user',
            "password": '123',
            "age": 22,
            "email": 'a@m.com'
        };

        it('should request register', async(() => {            

            authService.register('fname', 'lname', 'user', '123', 22, 'a@m.com').subscribe(
                response => expect(response).toEqual(''), 
                () => fail('should have succeeded')
            );
            const req = httpMock.expectOne((request: HttpRequest<any>) => {
                return request.method == 'POST'
                && request.url == 'http://localhost:8000/api/users/register'
                && JSON.stringify(request.body) == JSON.stringify(user)
            }); 
            req.flush('', { status: 200, statusText: 'OK' });
        }));

        it('should return an user already exists error', async(() => {

            authService.register('fname', 'lname', 'user', '123', 22, 'a@m.com').subscribe(
                () => fail('should have returned an error'),
                err => expect(err.error).toEqual('User already exists')
            );
            const req = httpMock.expectOne((request: HttpRequest<any>) => {
                return request.method == 'POST'
                && request.url == 'http://localhost:8000/api/users/register'
                && JSON.stringify(request. body) == JSON.stringify(user)
            });
            req.flush('User already exists', { status: 400, statusText: 'Bad Request' });
        }));

    })
})
import { routes } from './../app-routing.module';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpUserEvent, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import 'rxjs/add/operator/do';
import { AuthenticationService } from '../_services/authentication.service';

@Injectable()
export class OAuthInterceptor implements HttpInterceptor {
    isRefreshingToken: boolean = false;
    tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);
 
    constructor(private router: Router, private authenticationService: AuthenticationService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        debugger;
        if (req.headers.get('No-Auth') == "True") {
            return next.handle(req.clone());
        }

        if (localStorage.getItem('userToken') != null) {
            const clonedreq = req.clone({
                headers: req.headers.set("Authorization","Bearer "+localStorage.getItem('userToken'))
            });

            return next.handle(clonedreq)
            .do(
                succ => {},
                err => {
                    switch (err.status) {
                        case 400:
                            return this.handle400Error();
                        case 401:
                            return this.handle401Error(req, next);
                    }
                    if (err.status == 401) {
                        this.authenticationService.logout();
                        this.router.navigate(['/login']);
                    }
                }
            );
        }
        else{
            this.router.navigate(['/login']);
        }
    }

    handle400Error(){
        this.authenticationService.logout();
        this.router.navigate(['/login']);
    }

    handle401Error(req: HttpRequest<any>, next: HttpHandler) {
        if (!this.isRefreshingToken) {
            this.isRefreshingToken = true;
 
            // Reset here so that the following requests wait until the token
            // comes back from the refreshToken call.
            this.tokenSubject.next(null);
 
            return this.authenticationService.refreshToken()
                .switchMap((newToken: string) => {
                    if (newToken) {
                        this.tokenSubject.next(newToken);
                        return next.handle(this.addToken(this.getNewRequest(req), newToken));
                    }
 
                    // If we don't get a new token, we are in trouble so logout.
                    return this.logoutUser();
                })
                .catch(error => {
                    // If there is an exception calling 'refreshToken', bad news so logout.
                    return this.logoutUser();
                })
                .finally(() => {
                    this.isRefreshingToken = false;
                });
        } else {
            return this.tokenSubject
                .filter(token => token != null)
                .take(1)
                .switchMap(token => {
                    return next.handle(this.addToken(this.getNewRequest(req), token));
                });
        }
    }

}
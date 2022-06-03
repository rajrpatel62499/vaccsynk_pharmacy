import { VaccynkService } from 'src/app/services/vaccynk.service';
import { Router } from '@angular/router';
import { Injectable, Injector } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http'
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {

  constructor(private injector: Injector, 
    private _router: Router,
    private _auth: AuthService,
    private vacService: VaccynkService){}
  // intercept(req, next) {
  //   let authService = this.injector.get(AuthService)
  //   console.log(authService.getToken())
  //   let tokenizedReq = req.clone(
  //     {
  //       headers: req.headers.set('Authorization', 'bearer ' + authService.getToken())
  //     }
  //   )
  //   return next.handle(tokenizedReq)
  // }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const token = this._auth.getToken();
    if (token) {
        req = req.clone({headers: req.headers.set('authorization', 'Bearer ' + token)});
    } else {
        req = req.clone({headers: req.headers.set('authorization', 'Bearer ')});
    }

    if (req.reportProgress === true) {
        // this.http.loaderOn(true);
    }

    return next.handle(req).pipe(tap((event: HttpEvent<any>) => {
            if (event instanceof HttpResponse) {
                // this.http.loaderOn(false);
            }
        },
        (err: any) => {
            // this.http.loaderOn(false);
            if (err instanceof HttpErrorResponse) {
                if (err.status === 401) {
                    this._auth.logoutUser();
                    // this.vacService.handleError(err.error.message);
                } else {
                    // this.toastr.error(err.error.message || 'Something went wrong', 'OOPS!');
                    // this.vacService.handleError(err.error.message);
                }
            }
        }));
}

}

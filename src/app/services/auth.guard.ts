import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AppRoutes } from '../shared/models/app-routes';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private _authService: AuthService,
    private _router: Router) { }

  canActivate(): boolean {
    if (this._authService.loggedIn()) {
      console.log('true')
      return true;
    } else {
      console.log('false')            
      this._router.navigate(['/', AppRoutes.LOGIN])
      return false;
    }
  }
}
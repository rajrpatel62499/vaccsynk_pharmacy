import { AppRoutes } from './../../shared/models/app-routes';
import { VaccynkService } from 'src/app/services/vaccynk.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FacilityDataGuard implements CanActivate {

  constructor(private vacService: VaccynkService, private router: Router) {

  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    const editedFacility = this.vacService.getEditedFacility();
    if (editedFacility) {
      return true;
    } else {
      this.router.navigate([AppRoutes.ROOT, AppRoutes.FACILITIES])
      return false;
    } 
  }

}

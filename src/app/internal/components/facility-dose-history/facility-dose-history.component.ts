import { FacilityCenter } from './../../../shared/models/facility-center';
import { DoseFormData } from './../../../shared/models/dose-form';
import { DoseParams } from './../../../shared/models/params';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { VaccynkService } from 'src/app/services/vaccynk.service';
import { AppRoutes } from 'src/app/shared/models/app-routes';
import { map } from 'rxjs/operators';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-facility-dose-history',
  templateUrl: './facility-dose-history.component.html',
  styleUrls: ['./facility-dose-history.component.scss']
})
export class FacilityDoseHistoryComponent implements OnInit  {
  doseHistory: DoseFormData[] = []
  doseParams = new DoseParams();
  isLoading = false;
  constructor(
    public vaccynkService: VaccynkService,
    public activatedRoute: ActivatedRoute,
    private util: UtilsService,
    private router: Router) { }


  ngOnInit(): void {

    this.activatedRoute.paramMap
      .pipe(map(() => window.history.state)).subscribe(res => {
        this.loadByRoutes(res);
      })
  }

  loadByRoutes(res) {
    // if (res?.from == AppRoutes.USER_VAC) {

      const editedFacility: FacilityCenter = this.vaccynkService.getEditedFacility();
    if (this.util.isNullOrEmpty(editedFacility)) {
      this.util.handleError("OOPs something went wrong!");
    }
    
      let patientId = res.patientId;
      this.doseParams.patientId = patientId
      this.isLoading = true;

      this.doseParams.facilityId = editedFacility._id;

      this.vaccynkService.getDosesForFacility(this.doseParams).subscribe(res => {
        this.doseHistory = res.data;
        this.doseHistory = this.doseHistory
          .sort((a, b) => {
            let x = this.getDoseNumber(a.doseNumber);
            let y = this.getDoseNumber(b.doseNumber);
            return x - y;
          })
        console.log(this.doseHistory);
        this.isLoading = false;
      }, err => {
        this.isLoading = false;
        console.log(err);
        this.util.handleError(err.error.message);
      })

    // } else {
    //   this.router.navigate([AppRoutes.ROOT, AppRoutes.DASHBOARD]);
    // }
  }

  switchRouting() {
    // this.router.navigate([])
    this.util.goBack();
    // this.router.navigate([AppRoutes.ROOT, AppRoutes.USER_VAC]);
  }

  getDoseNumber(a: string) {
    switch (a) {
      case 'FIRST':
        return 1;
      case 'SECOND':
        return 2;
      case 'OTHER':
        return 3;
    }
  }
  // ngOnDestory() {
  //   this.router.navigateByUrl(`${AppRoutes.ROOT}/${AppRoutes.USER_VAC}`, { state: { from: AppRoutes.DOSE_HISTORY } });
  // }

  goBack() {
    this.router.navigateByUrl(`${AppRoutes.ROOT}/${AppRoutes.USERS}`, { state: { from: AppRoutes.DOSE_HISTORY } });
  }
}

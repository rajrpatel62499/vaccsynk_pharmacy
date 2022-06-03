import { FacilityUserVacFormComponent } from './../components/facility-user-vac-form/facility-user-vac-form.component';
import { FacilityDoseHistoryComponent } from './../components/facility-dose-history/facility-dose-history.component';
import { FacilityAddOtherDoseComponent } from './../components/facility-add-other-dose/facility-add-other-dose.component';
import { SharedModule } from './../../shared/shared.module';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FacilitiesComponent } from './facilities.component';
import { FacilitiesNewRequestComponent } from './facilities-new-request/facilities-new-request.component';
import { FacilitiesDoseOneComponent } from './facilities-dose-one/facilities-dose-one.component';
import { FacilitiesDoseTwoComponent } from './facilities-dose-two/facilities-dose-two.component';
import { AppRoutes } from 'src/app/shared/models/app-routes';
import { AddOtherDoseComponent } from '../components/add-other-dose/add-other-dose.component';
import { DoseHistoryComponent } from '../components/dose-history/dose-history.component';
import { UserVacFormComponent } from '../components/user-vac-form/user-vac-form.component';
import { FacilitiesHeaderComponent } from './facilities-header/facilities-header.component';
import { FacilitiesListComponent } from './facilities-list/facilities-list.component';
import { FacilityDataGuard } from './facility-data.guard';

const routes: Routes = [
  {
    path: '', children: [
      { path: '', component: FacilitiesComponent },
      {
        path: AppRoutes.NEW_REQ, 
        canActivate: [FacilityDataGuard],
        children: [
          { path: '', component: FacilitiesNewRequestComponent,  data: { breadcrumb: { label: 'New Request'} } },

          { path: AppRoutes.FACILITY_USER_VAC, component: FacilityUserVacFormComponent,  data: { breadcrumb: { label: 'Request Preview'} } },
          { path: AppRoutes.FACILITY_ADD_OTH_DOSE, component: FacilityAddOtherDoseComponent, data: { breadcrumb: { label: 'Add Dose'} } },
          { path: AppRoutes.FACILITY_DOSE_HISTORY, component: FacilityDoseHistoryComponent, data: { breadcrumb: { label: 'Dose History'} } }
        ],
        // data: { breadcrumb: { label: 'New Request', disable: true} }
      },
      {
        path: AppRoutes.DOSE_ONE, 
        canActivate: [FacilityDataGuard],
        children: [
          { path: '', component: FacilitiesDoseOneComponent,  data: { breadcrumb: { label: 'Dose One'} } },

          { path: AppRoutes.FACILITY_USER_VAC, component: FacilityUserVacFormComponent,  data: { breadcrumb: { label: 'Request Preview'} } },
          { path: AppRoutes.FACILITY_ADD_OTH_DOSE, component: FacilityAddOtherDoseComponent, data: { breadcrumb: { label: 'Add Dose'} } },
          { path: AppRoutes.FACILITY_DOSE_HISTORY, component: FacilityDoseHistoryComponent, data: { breadcrumb: { label: 'Dose History'} } }
        ], 
        // data: { breadcrumb: { label: 'Dose One', disable: true} }
      },
      {
        path: AppRoutes.DOSE_TWO,
        canActivate: [FacilityDataGuard],
        children: [
          { path: '', component: FacilitiesDoseTwoComponent,  data: { breadcrumb: { label: 'Dose Two'} } },

          { path: AppRoutes.FACILITY_USER_VAC, component: FacilityUserVacFormComponent,  data: { breadcrumb: { label: 'Request Preview'} } },
          { path: AppRoutes.FACILITY_ADD_OTH_DOSE, component: FacilityAddOtherDoseComponent, data: { breadcrumb: { label: 'Add Dose'} } },
          { path: AppRoutes.FACILITY_DOSE_HISTORY, component: FacilityDoseHistoryComponent, data: { breadcrumb: { label: 'Dose History'} } }
        ],
        // data: { breadcrumb: { label: 'Dose Two', disable: true} }
      },
    ]
  }
]

@NgModule({
  declarations: [FacilitiesComponent, FacilitiesNewRequestComponent, FacilitiesDoseOneComponent, FacilitiesDoseTwoComponent, FacilitiesHeaderComponent, FacilitiesListComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class FacilitiesModule { }

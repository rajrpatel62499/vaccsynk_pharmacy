import { UsersHeaderComponent } from './users-header/users-header.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from './../../shared/shared.module';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersComponent } from './users.component';
import { DoseOneComponent } from './dose-one/dose-one.component';
import { DoseTwoComponent } from './dose-two/dose-two.component';
import { NewRequestComponent } from './new-request/new-request.component';
import { AppRoutes } from 'src/app/shared/models/app-routes';
import { AddOtherDoseComponent } from '../components/add-other-dose/add-other-dose.component';
import { DoseHistoryComponent } from '../components/dose-history/dose-history.component';
import { UserVacFormComponent } from '../components/user-vac-form/user-vac-form.component';
import { ReminderComponent } from '../reminder/reminder.component';


const routes: Routes = [
  {
    path: '', children: [
      {
        path: '', component: UsersComponent,
      },
      {
        path: AppRoutes.NEW_REQ, 
        children: [
          { path: '', component: NewRequestComponent,  data: { breadcrumb: { label: 'New Request'} } },
          { path: AppRoutes.USER_VAC, component: UserVacFormComponent,  data: { breadcrumb: { label: 'Request Preview'} } },
          { path: AppRoutes.ADD_OTH_DOSE, component: AddOtherDoseComponent, data: { breadcrumb: { label: 'Add Dose'} } },
          // { path: AppRoutes.REMINDER, component: ReminderComponent, data: { breadcrumb: { label: 'Reminder'} } },
          { path: AppRoutes.DOSE_HISTORY, component: DoseHistoryComponent, data: { breadcrumb: { label: 'Dose History'} } }
        ],
      },
      {
        path: AppRoutes.DOSE_ONE, children: [
          { path: '', component: DoseOneComponent,  data: { breadcrumb: { label: 'Dose One'} } },
          { path: AppRoutes.USER_VAC, component: UserVacFormComponent,  data: { breadcrumb: { label: 'Request Preview'} } },
          { path: AppRoutes.ADD_OTH_DOSE, component: AddOtherDoseComponent, data: { breadcrumb: { label: 'Add Dose'} } },
          // { path: AppRoutes.REMINDER, component: ReminderComponent, data: { breadcrumb: { label: 'Reminder'} } },
          { path: AppRoutes.DOSE_HISTORY, component: DoseHistoryComponent, data: { breadcrumb: { label: 'Dose History'} } }
        ], 
      },
      {
        path: AppRoutes.DOSE_TWO, children: [
          { path: '', component: DoseTwoComponent,  data: { breadcrumb: { label: 'Dose Two'} } },
          { path: AppRoutes.USER_VAC, component: UserVacFormComponent,  data: { breadcrumb: { label: 'Request Preview'} } },
          { path: AppRoutes.ADD_OTH_DOSE, component: AddOtherDoseComponent, data: { breadcrumb: { label: 'Add Dose'} } },
          // { path: AppRoutes.REMINDER, component: ReminderComponent, data: { breadcrumb: { label: 'Reminder'} } },
          { path: AppRoutes.DOSE_HISTORY, component: DoseHistoryComponent, data: { breadcrumb: { label: 'Dose History'} } }
        ],
      },
    ]
  }
]
@NgModule({
  declarations: [UsersComponent, DoseOneComponent, DoseTwoComponent, NewRequestComponent, UsersHeaderComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class UsersModule { }

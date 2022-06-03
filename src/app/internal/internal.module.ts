import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InternalComponent } from './internal.component';
import { Routes, RouterModule } from '@angular/router';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { HeaderComponent } from './components/header/header.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { DatepickerModule, BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { OnlynumericDirective } from '../internal/directives/onlynumeric.directive';
import { AddOtherDoseComponent } from './components/add-other-dose/add-other-dose.component';
import { ReminderComponent } from './reminder/reminder.component';
import { DoseHistoryComponent } from './components/dose-history/dose-history.component';
import { BroadcastMessageComponent } from './../shared/modals/broadcast-message/broadcast-message.component';
import { EditTimingsComponent } from '../shared/modals/edit-timings/edit-timings.component';
import { UserVacFormComponent } from './components/user-vac-form/user-vac-form.component';
import { AppRoutes } from '../shared/models/app-routes';
import { SignaturePadModule } from 'angular2-signaturepad';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';

import {
  NgxUiLoaderModule,
  NgxUiLoaderConfig,
  SPINNER,
  POSITION,
  PB_DIRECTION,
  NgxUiLoaderRouterModule,
  NgxUiLoaderHttpModule
} from 'ngx-ui-loader';
import { NotificationComponent } from './notification/notification.component';
import { FacilityAddOtherDoseComponent } from './components/facility-add-other-dose/facility-add-other-dose.component';
import { FacilityDoseHistoryComponent } from './components/facility-dose-history/facility-dose-history.component';
import { FacilityUserVacFormComponent } from './components/facility-user-vac-form/facility-user-vac-form.component';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { ChangePasswordAfterLoginComponent } from '../external/login/change-password-after-login/change-password-after-login.component';
import { ExternalAuthguardService } from '../services/external-authguard.service';


const ngxUiLoaderConfig: NgxUiLoaderConfig = {
  bgsColor: '#87cefa',
  fgsColor: '#87cefa',
  pbColor: '#87cefa'
};


const routes: Routes = [
  {
    path: '', component: InternalComponent,
    children: [
      {
        path: AppRoutes.DASHBOARD,
        data: { preload: true, breadcrumb: "Dashboard" },
        loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
      },
      {
        path: AppRoutes.USERS,
        data: { preload: true, loadAfterSeconds: 1, breadcrumb: { label: "Users", disable: true} },
        loadChildren: () => import('./users/users.module').then(m => m.UsersModule)
      },
      {
        path: AppRoutes.FACILITIES,
        data: { preload: true, loadAfterSeconds: 1, breadcrumb: "Facilities" },
        loadChildren: () => import('./facilities/facilities.module').then(m => m.FacilitiesModule)
      },
      {
        path: AppRoutes.NOTIFICATION,
        data: { preload: true, loadAfterSeconds: 1, breadcrumb: "Notification" },
        loadChildren: () => import('./notification/notification.module').then(m => m.NotificationModule)
      },
      {
        path: AppRoutes.SETTINGS,
        data: { preload: true, loadAfterSeconds: 1, breadcrumb: "Settings" },
        loadChildren: () => import('./settings/settings.module').then(m => m.SettingsModule)
      },
      {
        path: AppRoutes.VACCINATOR,
        data: { preload: true, loadAfterSeconds: 1, breadcrumb: "Vaccinator" },
        loadChildren: () => import('./vaccinator/vaccinator.module').then(m => m.VaccinatorModule)
      },
    
      // { path:  AppRoutes.USER_VAC, component: UserVacFormComponent},
      // { path: AppRoutes.ADD_OTH_DOSE, component: AddOtherDoseComponent},
      // { path: AppRoutes.REMINDER, component: ReminderComponent},
      // {path:  AppRoutes.DOSE_HISTORY,component:DoseHistoryComponent}
    ],
  },
  { path: AppRoutes.CHANGE_PASSWORD_AFTER_LOGIN,
    component: ChangePasswordAfterLoginComponent,
    data: { title: 'Change Password' }
  },
  {
    path: '**',
    redirectTo: AppRoutes.DASHBOARD
  }

];

@NgModule({
  declarations: [
    InternalComponent,
    SidebarComponent,
    HeaderComponent,
    AddOtherDoseComponent,
    ReminderComponent,
    DoseHistoryComponent,
    BroadcastMessageComponent,
    EditTimingsComponent,
    UserVacFormComponent,
    // OnlynumericDirective,
    NotificationComponent,
    FacilityAddOtherDoseComponent,
    FacilityDoseHistoryComponent,
    FacilityUserVacFormComponent,
    
  ],
  imports: [
    CommonModule,
    GooglePlaceModule,
    SignaturePadModule,
    BsDropdownModule,
    RouterModule.forChild(routes),
    SharedModule,
    ScrollToModule.forRoot(),
    // BsDropdownModule.forRoot(),
    BsDatepickerModule.forRoot(),
    DatepickerModule.forRoot(),
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
    NgxUiLoaderRouterModule, // import this module for showing loader automatically when navigating between app routes
    NgxUiLoaderHttpModule.forRoot({ showForeground: true })

  ]
})
export class InternalModule { }

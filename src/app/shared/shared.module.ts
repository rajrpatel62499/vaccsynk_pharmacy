import { OnlynumericDirective } from './../internal/directives/onlynumeric.directive';
import { MaterialModule } from './modules/material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditPharmacyInfoComponent } from './modals/edit-pharmacy-info/edit-pharmacy-info.component';
import { AvatarModule } from 'ngx-avatar';
import { TimingsPipe } from './pipes/timings.pipe';
import {BreadcrumbModule} from 'xng-breadcrumb';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { VerifyEmailIdComponent } from './modals/verify-email-id/verify-email-id.component';
import { NgOtpInputModule } from 'ng-otp-input';
import { MatSelectModule } from '@angular/material/select';
import { BsDatepickerModule, DatepickerModule } from 'ngx-bootstrap/datepicker';
import { VaccinatorDetailsComponent } from './modals/vaccinator-details/vaccinator-details.component';
import { VerifyVaccinatorCodeComponent } from './modals/verify-vaccinator-code/verify-vaccinator-code.component';
import { InputRestrictionDirective } from './pipes/InputRestrictionDirective.directive';
import { AlertModule } from 'ngx-bootstrap/alert';
import { GooglePlaceModule } from "ngx-google-places-autocomplete";
import { ChangePasswordModalComponent } from './modals/change-password-modal/change-password-modal.component';
import { PreviewSignatureImgComponent } from './modals/preview-signature-img/preview-signature-img.component';
import { VerifyFacilityVaccinatorComponent } from './modals/verify-facility-vaccinator/verify-facility-vaccinator.component';
import { SignaturePreviewFacilityComponent } from './modals/signature-preview-facility/signature-preview-facility.component';
import { ImagePreviewAddoseComponent } from './modals/image-preview-addose/image-preview-addose.component';
import { SignaturePreviewAdddoseComponent } from './modals/signature-preview-adddose/signature-preview-adddose.component';
import { DashboardSkeletonComponent } from '../internal/components/dashboard-skeleton/dashboard-skeleton.component';
// import { DashboardSkeletonComponent } from './modals/dashboard-skeleton/dashboard-skeleton.component';




@NgModule({
  declarations: [EditPharmacyInfoComponent, TimingsPipe, VerifyEmailIdComponent, OnlynumericDirective,InputRestrictionDirective, VaccinatorDetailsComponent, VerifyVaccinatorCodeComponent, ChangePasswordModalComponent, PreviewSignatureImgComponent, VerifyFacilityVaccinatorComponent, SignaturePreviewFacilityComponent, ImagePreviewAddoseComponent, SignaturePreviewAdddoseComponent,DashboardSkeletonComponent],
  imports: [
    CommonModule,
    MaterialModule,
    BsDropdownModule.forRoot(),
    ReactiveFormsModule,
    FormsModule,
    AvatarModule,
    BreadcrumbModule,
    NgxSkeletonLoaderModule,
    MatSelectModule,
    NgOtpInputModule,
    BsDatepickerModule.forRoot(),
    DatepickerModule.forRoot(),
    GooglePlaceModule
  ],
  exports: [
    MaterialModule,
    BsDropdownModule,
    ReactiveFormsModule,
    FormsModule,
    AvatarModule,
    TimingsPipe,
    BreadcrumbModule,
    NgxSkeletonLoaderModule,
    NgOtpInputModule,
    InputRestrictionDirective,
    OnlynumericDirective,
    BsDatepickerModule,
    DatepickerModule,
    GooglePlaceModule,
    DashboardSkeletonComponent
  ],
  providers: []
})
export class SharedModule { }

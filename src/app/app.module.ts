import { UtilsService } from './services/utils.service';
import { ResetPasswordComponent } from './external/reset-password/reset-password.component';
import { VaccynkService } from './services/vaccynk.service';
import { SharedModule } from './shared/shared.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './external/login/login.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { ForgotPasswordComponent } from './external/forgot-password/forgot-password.component';
import { OtpVerificationComponent } from './external/otp-verification/otp-verification.component';
// import { NgOtpInputModule } from 'ng-otp-input';
import { AuthGuard } from './services/auth.guard';
import { AuthService } from './services/auth.service';
import { TokenInterceptorService } from './services/token-interceptor.service';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { DatepickerModule, BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { RegisterCenterComponent } from './external/register-center/register-center.component';
import {MatSelectModule} from '@angular/material/select';
import { AlertModule } from 'ngx-bootstrap/alert';
import { ScrollToService } from '@nicky-lenaers/ngx-scroll-to';
import { ChangePasswordAfterLoginComponent } from './external/login/change-password-after-login/change-password-after-login.component';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ForgotPasswordComponent,
    OtpVerificationComponent,
    ResetPasswordComponent,
    RegisterCenterComponent,
    ChangePasswordAfterLoginComponent,
    

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule,
    HttpClientModule,
    AlertModule.forRoot(),
    MatCheckboxModule,
    // NgOtpInputModule,
    BsDatepickerModule.forRoot(),
    DatepickerModule.forRoot(),
    ToastrModule.forRoot({
      closeButton: true,
      timeOut: 3000,
      progressAnimation: 'increasing',
      preventDuplicates: true,
      resetTimeoutOnDuplicate: true,
      progressBar: true
  }),
  ],
  providers: [
    AuthService, AuthGuard,{
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    },
    UtilsService,
    VaccynkService,
    ScrollToService
  ],
  bootstrap: [AppComponent],
  entryComponents: []
})
export class AppModule { }

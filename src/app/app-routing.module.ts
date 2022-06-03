import { ChangePasswordAfterLoginComponent } from './external/login/change-password-after-login/change-password-after-login.component';
import { AppRoutes } from 'src/app/shared/models/app-routes';
import { CustomPreloadingStrategyService } from './services/custom-preloading-strategy.service';
import { RegisterCenterComponent } from './external/register-center/register-center.component';
import { ResetPasswordComponent } from './external/reset-password/reset-password.component';
import { AuthGuard } from './services/auth.guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule, CanActivate,PreloadAllModules } from '@angular/router';
import { LoginComponent } from './external/login/login.component';
import { ForgotPasswordComponent } from './external/forgot-password/forgot-password.component';
import { OtpVerificationComponent } from './external/otp-verification/otp-verification.component';
import { ExternalAuthguardService } from './services/external-authguard.service';

const routes: Routes = [

  { path: AppRoutes.REGISTER_PHARMACY,
    component: RegisterCenterComponent,
    canActivate: [ExternalAuthguardService],
    data: { title: 'Register Facility' }
  },
  { path: AppRoutes.LOGIN,
    component: LoginComponent,
    canActivate: [ExternalAuthguardService],
    data: { title: 'Login Facility' }
  },
  {
    path: AppRoutes.FORGOT_PASS,
    component: ForgotPasswordComponent,
    canActivate: [ExternalAuthguardService],
    data: { title: 'Forgot Password' }
  },
  {
    path: AppRoutes.OTP_VERIFY,
    component: OtpVerificationComponent,
    canActivate: [ExternalAuthguardService],
    data: { title: 'OTP' }
  },
  {
    path: AppRoutes.RESET_PASS,
    component: ResetPasswordComponent,
    canActivate: [ExternalAuthguardService],
    data: { title: 'Reset Password' }
  },
  { 
    path: '', 
    data: { preload: true},
    loadChildren: ()=> import('./internal/internal.module').then(m => m.InternalModule),
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    component: LoginComponent
  }
   
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: CustomPreloadingStrategyService})],
  exports: [RouterModule]
})
export class AppRoutingModule { }

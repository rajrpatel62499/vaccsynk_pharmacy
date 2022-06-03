import { UtilsService } from 'src/app/services/utils.service';
import { VaccynkService } from 'src/app/services/vaccynk.service';
import { AuthService } from 'src/app/services/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppRoutes } from 'src/app/shared/models/app-routes';
import { REGEXP } from 'src/app/services/regexp';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  forgotPasswordForm : FormGroup;
  submitted = false;
  AppRoutes = AppRoutes;
  isLoading = false;
  get f() { return this.forgotPasswordForm.controls; }
  constructor( private formBuilder: FormBuilder,
    private _regexp: REGEXP,
    public router: Router,
    public _auth: AuthService,
    public _vacService: VaccynkService,
    private util: UtilsService
    ) { }

  ngOnInit(): void {
    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email,Validators.pattern(this._regexp.EMAIL_REGEXP)]],
    },);
  }

  sendOtp(){
    this.submitted = true;
    console.log('register btn working')

    // stop here if form is invalid
    if (this.forgotPasswordForm.invalid) {
        return;
    }
    this.isLoading = true;
    // display form values on success
    // alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.forgotPasswordForm.value, null, 4));
    this._auth.requestOtp(this.forgotPasswordForm.value).subscribe(res=>{
        this.util.showToaster(`OTP resent successfully to ${this.f.email.value}`);
        this.isLoading = false;
        localStorage.setItem("email", this.f.email.value);
        this.router.navigate([AppRoutes.ROOT,AppRoutes.OTP_VERIFY]);
      },
      err=>{
        this.isLoading = false;
        this.util.handleError(err.error.message);
        console.log(err);
      })
  }

}

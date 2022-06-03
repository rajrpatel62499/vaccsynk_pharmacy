import { UtilsService } from 'src/app/services/utils.service';
import { VaccynkService } from '../../services/vaccynk.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { MustMatch } from 'src/app/shared/_helpers/must-match.validator';
import { AppRoutes } from 'src/app/shared/models/app-routes';

@Component({
  selector: 'app-change-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  hide = true;
  hide1 = true;
  chnagePasswordForm : FormGroup;
  submitted = false;
  email:string;
  isLoading = false;
  AppRoutes = AppRoutes;
  
  constructor(private formBuilder: FormBuilder,
    private _vacService: VaccynkService,
    private util: UtilsService,
    private _auth: AuthService, private _router: Router) { }

  ngOnInit(): void {
    this.email = localStorage.getItem("email");
    this.chnagePasswordForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    }
    ,{
      validator: MustMatch('password', 'confirmPassword')
    });

  }

  get f() { return this.chnagePasswordForm.controls; }
  
  loginUserData = {}

  // loginUser () {
  //   this._auth.loginUser(this.chnagePasswordForm.value)
  //   .subscribe(
  //     res => {
  //       localStorage.setItem('portalAccessToken', res.data.accessToken)
  //       this._router.navigate(['/']);
  //     },
  //     err => console.log(err)
  //   ) 
  // }
  
  onSubmit() {
    this.submitted = true;
    console.log('register btn working')

    // stop here if form is invalid
    if (this.chnagePasswordForm.invalid) {
        return;
    }
    this.isLoading = true;
    // this.loginUser();
    this._auth.changePassword({email: this.email, password: this.f.password.value}).subscribe(res=>{
      this.util.showToaster(`Your password changed successfully`);
      this.isLoading = false;
      this._router.navigate([AppRoutes.ROOT,AppRoutes.LOGIN]);
    }, err=>{
      console.log(err);
      this.isLoading = false;
      this.util.handleError(err.error?.message);
    })    
  }
}

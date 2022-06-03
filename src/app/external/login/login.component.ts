import { UtilsService } from 'src/app/services/utils.service';
import { VaccynkService } from 'src/app/services/vaccynk.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { forkJoin } from 'rxjs';
import { AppRoutes } from 'src/app/shared/models/app-routes';
import { REGEXP } from 'src/app/services/regexp';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  isLoading = false;
  AppRoutes=AppRoutes;
  // private _regexp: any;

  constructor(private formBuilder: FormBuilder,  
    private util: UtilsService,
    private _regexp: REGEXP, private _auth: AuthService, private _router: Router, public vaccynkService: VaccynkService) { }
  hide = true;
  loginForm: FormGroup;
  submitted = false;
  get f() { return this.loginForm.controls; }


  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email,Validators.pattern(this._regexp.EMAIL_REGEXP)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }



  login() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    this.isLoading = true;
    this.loginUser();
  }

  loginUser() {
    this._auth.loginUser(this.loginForm.value)
      .subscribe(
        res => {       
          console.log(res);             
          localStorage.setItem('portalAccessToken', res.data.accessToken);
          if (res.data.isFirstTime) {
            this._router.navigateByUrl(`/${AppRoutes.CHANGE_PASSWORD_AFTER_LOGIN}`);
          } else {
            this.getUserData();
          }
          
          // const updateProfile = localStorage.getItem('updateProfile');
          // if (!updateProfile) {
          //   localStorage.setItem('updateProfile', 'false');
          // }
          

          this.util.showToaster("Logged in successfully ! ")
        },
        err => {          
          console.log(err)
          this.isLoading = false;
          this.util.handleError(err.error?.message);
        }
      )
  }

  getUserData(){
    this._auth.getUserProfile().subscribe((res:any)=>{      
      this._auth.setUserProfileData(res.data);
      this.util.onUserDataGet(true);
      if(res.data.addedTimings){
        this._router.navigate([AppRoutes.ROOT,AppRoutes.DASHBOARD]);
      } else{
        this._router.navigate([AppRoutes.ROOT,AppRoutes.SETTINGS]);
        this.util.showToaster("Please update setting",'warning')
      }
    })
  }

  forgotPassword() {
    this._router.navigate([AppRoutes.ROOT,AppRoutes.FORGOT_PASS]);
  }

}

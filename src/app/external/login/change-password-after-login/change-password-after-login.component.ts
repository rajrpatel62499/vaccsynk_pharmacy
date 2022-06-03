import { finalize } from 'rxjs/operators';
import { MustMatch } from 'src/app/shared/_helpers/must-match.validator';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { VaccynkService } from '../../../services/vaccynk.service';
import { UtilsService } from '../../../services/utils.service';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { AppRoutes } from 'src/app/shared/models/app-routes';


@Component({
  selector: 'app-change-password-after-login',
  templateUrl: './change-password-after-login.component.html',
  styleUrls: ['./change-password-after-login.component.scss']
})
export class ChangePasswordAfterLoginComponent implements OnInit  {
  changePasswordForm: FormGroup;
  submitted = false;
  isLoading = false;

  showPassword: boolean = true;
  oldPassword: boolean = true;
  showConfirmPassword: boolean = true;
  AppRoutes = AppRoutes;

  constructor(
    private formBuilder: FormBuilder,
    private _vacService: VaccynkService,
    private util: UtilsService,
    private _auth: AuthService,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this.changePasswordForm = this.formBuilder.group(
      {
        oldPassword: ['',Validators.required],
        newPassword : ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
      },
      {
        validator: MustMatch('newPassword', 'confirmPassword'),
      }
    );
  }

  get f() {
    return this.changePasswordForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.changePasswordForm.invalid) {
      // this.http.handleError("Please check all fields");
      return;
    }

    const postData = {
      oldPassword: this.changePasswordForm.controls.oldPassword.value,
      newPassword: this.changePasswordForm.controls.newPassword.value,
    };

    this.isLoading = true;

    this._auth.changePasswordFromSetting(postData).subscribe(
      (res) => {
        this.util.showToaster(`Your password changed successfully`);
        this.isLoading = false;
        this.getUserData();
      },
      (err) => {
        console.log(err);
        this.isLoading = false;
        this.util.handleError(err.error?.message);
      }
    );
  }

  getUserData(){
    this.isLoading = true;
    this._auth.getUserProfile().pipe(finalize(()=>{this.isLoading = false;})).subscribe((res:any)=>{      
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
  
 
}

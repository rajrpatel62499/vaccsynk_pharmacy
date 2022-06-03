import { UtilsService } from 'src/app/services/utils.service';
import { Component, OnInit,ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { VaccynkService } from 'src/app/services/vaccynk.service';
import { AppRoutes } from 'src/app/shared/models/app-routes';

@Component({
  selector: 'app-otp-verification',
  templateUrl: './otp-verification.component.html',
  styleUrls: ['./otp-verification.component.scss']
})
export class OtpVerificationComponent implements OnInit {
  AppRoutes=AppRoutes;

  otp: string;
  isLoading = false;
  @ViewChild('ngOtpInput', { static: false}) ngOtpInput: any;
  config = {
    allowNumbersOnly: false,
    length: 6,
    isPasswordInput: false,
    disableAutoFocus: false,
    placeholder: '',
    inputStyles: {
      'width': '60px',
      'height': '60px'
    }
  };
  email: string;

  constructor(  public router: Router,
    public _auth: AuthService,
    private util: UtilsService,
    public _vacService: VaccynkService) {
      this.email = localStorage.getItem("email");
     }

  ngOnInit(): void {
  }
  onOtpChange(otp) {
    this.otp = otp;
  }

  verifyCode() {
    this.isLoading = true;
    this._auth.verifyOtp({code: this.otp, email: this.email}).subscribe(res => {
      this.util.showToaster(`Otp verified successfully`);
      this.isLoading = false;
      this.router.navigate([AppRoutes.ROOT,AppRoutes.RESET_PASS]);
      // localStorage.removeItem("email");
    },
    err => {
      this.isLoading = false;
      this.util.handleError(err.error?.message);
    })
  }
  
  resendCode() {
    this._auth.requestOtp({email:this.email}).subscribe(res=>{
      this.util.showToaster(`Otp resent successfully to ${this.email}`);
    },
    err=>{
      console.log(err);
      this.util.handleError(err.error?.message);
    })
  }

}

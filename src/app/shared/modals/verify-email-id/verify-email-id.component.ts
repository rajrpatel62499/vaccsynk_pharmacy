import { UtilsService } from 'src/app/services/utils.service';
import { AuthService } from 'src/app/services/auth.service';
import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgOtpInputComponent } from 'ng-otp-input/lib/components/ng-otp-input/ng-otp-input.component';
import { PharmacyRegisterForm } from '../../models/pharmacy-register-form';

@Component({
  selector: 'app-verify-email-id',
  templateUrl: './verify-email-id.component.html',
  styleUrls: ['./verify-email-id.component.scss']
})
export class VerifyEmailIdComponent implements OnInit {
  otp: string;
  isLoading=false;
  
  @ViewChild('ngOtpInput', { static: false}) ngOtpInput: NgOtpInputComponent;
  config = {
    allowNumbersOnly: false,
    length: 6,
    isPasswordInput: false,
    disableAutoFocus: false,
    placeholder: '',
    inputStyles: {
      'width': '40px',
      'height': '40px'
    }
  };

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: PharmacyRegisterForm,
    public dialogRef: MatDialogRef<VerifyEmailIdComponent>,
    public auth: AuthService,
    public util: UtilsService

    ) 
  {
    console.log(data);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void { }

  onOtpChange(otp) {
    this.otp = otp;
  }

  verifyOtp() {
    console.log(this.otp);
    let payload = {
      code : this.otp,
      email : this.data.email
    }
    this.isLoading = true;
    this.auth.verifyOtpForVacCenter(payload).subscribe(res => this.onVerifyOtpSuccessful(res), err=> this.onVerifyOtpFailed(err))
  }
  
  private onVerifyOtpSuccessful(res) {
    this.isLoading = true;
    let payload:PharmacyRegisterForm = this.data;

    this.auth.postPharmacyForm(payload).subscribe((res)=>{
      this.isLoading = false;
      console.log(res);
      this.util.showToaster(`Your pharmacy registered successfully with email ${this.data.email}`);
      this.dialogRef.close(this.data);

    }, (err)=>{
      this.isLoading = false;
      this.util.handleError(err.error.message);
      console.log(err);
      if(err.error.responseType == 'DUPLICATE') {
        // this.http.showToaster(`You are already register with ${this.data.email}`, 'error')
        this.dialogRef.close();
      }else {
        // this.http.showToaster('Oops Something Went Wrong', 'error')
        this.dialogRef.close();
      }
    })
  }

  private onVerifyOtpFailed(err) {
    console.log(err)
    this.isLoading = false;
    if(err.error.responseType == 'INVALID_OTP') {
      this.util.showToaster('Please Enter Valid OTP', 'error')
    }else if(err.error.message == "code is required") {
    }
    this.util.showToaster('Please Enter Valid OTP', 'error')
  }


  resendOtp() {
    let payload={
      email: this.data.email
    };
    this.auth.requestOtpForVacCenter(payload).subscribe(res => this.onResendOtpSuccessful(res), err=> this.onResendOtpFailed(err));
  }

  private onResendOtpSuccessful(res) {
    console.log(res);
    this.util.showToaster(`OTP resent successfully`);
  }
  private onResendOtpFailed(err) {
    if(err.error.responseType == 'USER_EXISTS') {
      console.log(`${this.data.email} already exists`);
    }
  }


}

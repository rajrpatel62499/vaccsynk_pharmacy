import { VaccynkService } from 'src/app/services/vaccynk.service';
import { DoseFormData } from './../../models/dose-form';
import { Vaccinator } from 'src/app/shared/models/vaccinator';
import { UtilsService } from 'src/app/services/utils.service';
import { AuthService } from 'src/app/services/auth.service';
import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgOtpInputComponent } from 'ng-otp-input/lib/components/ng-otp-input/ng-otp-input.component';
import { PharmacyRegisterForm } from '../../models/pharmacy-register-form';
@Component({
  selector: 'app-verify-vaccinator-code',
  templateUrl: './verify-vaccinator-code.component.html',
  styleUrls: ['./verify-vaccinator-code.component.scss']
})
export class VerifyVaccinatorCodeComponent implements OnInit {
  otp: string;

  vaccinator: Vaccinator;
  doseFormData: DoseFormData;
  isLoading: boolean = false;

  @ViewChild('ngOtpInput', { static: false}) ngOtpInput: NgOtpInputComponent;
  config = {
    allowNumbersOnly: false,
    length: 4,
    isPasswordInput: false,
    disableAutoFocus: false,
    placeholder: '',
    inputStyles: {
      'width': '40px',
      'height': '40px'
    }
  };

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { vaccinator: Vaccinator, doseFormData: DoseFormData},
    public dialogRef: MatDialogRef<VerifyVaccinatorCodeComponent>,
    public auth: AuthService,
    public util: UtilsService,
    private _vacService: VaccynkService
  ) {
    console.log(this.data);
    this.vaccinator = this.data.vaccinator;
    this.doseFormData = this.data.doseFormData;
   }

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onOtpChange(otp) {
    this.otp = otp;
  }

  onSubmit() {

    if (this.otp == this.vaccinator.uniqueId) {
      // submit the form
      this.isLoading = true;
      this._vacService.addDoseForm(this.doseFormData).subscribe(
        res => {
          console.log(res);
          this.isLoading = false;
          this.util.showToaster("Dose Added Successfully!");
          console.log(this.doseFormData);
          this.dialogRef.close(true);
          // this.util.goBack();
        }, err => {
          console.log(err);
          this.isLoading = false;
          this.util.handleError(err.error?.message);
          console.log(this.doseFormData);
        }
      )
    } else {
      this.util.handleError("Code is invalid");
    }
  }

}

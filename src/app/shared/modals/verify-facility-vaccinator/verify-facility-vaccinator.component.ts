import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgOtpInputComponent } from 'ng-otp-input/lib/components/ng-otp-input/ng-otp-input.component';
import { AuthService } from 'src/app/services/auth.service';
import { UtilsService } from 'src/app/services/utils.service';
import { VaccynkService } from 'src/app/services/vaccynk.service';
import { DoseFormData } from '../../models/dose-form';
import { Vaccinator } from '../../models/vaccinator';
import { VerifyVaccinatorCodeComponent } from '../verify-vaccinator-code/verify-vaccinator-code.component';

@Component({
  selector: 'app-verify-facility-vaccinator',
  templateUrl: './verify-facility-vaccinator.component.html',
  styleUrls: ['./verify-facility-vaccinator.component.scss']
})
export class VerifyFacilityVaccinatorComponent implements OnInit {
  otp: string;

  vaccinator: Vaccinator;
  doseForms: DoseFormData;
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
    @Inject(MAT_DIALOG_DATA) public data: { vaccinator: Vaccinator, doseForms: DoseFormData},
    public dialogRef: MatDialogRef<VerifyFacilityVaccinatorComponent>,
    public auth: AuthService,
    public util: UtilsService,
    private _vacService: VaccynkService
  ) {
    console.log(this.data);
    this.vaccinator = this.data.vaccinator;
    this.doseForms = this.data.doseForms;
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
      this._vacService.addDoseFormForFacility(this.doseForms).subscribe(
        res => {
          console.log(res);
          this.isLoading = false;
          this.util.showToaster("Dose Added Successfully!");
          console.log(this.doseForms);
          this.dialogRef.close(true);
          // this.util.goBack();
        }, err => {
          console.log(err);
          this.isLoading = false;
          this.util.handleError(err.error?.message);
          console.log(this.doseForms);
        }
      )
    } else {
      this.util.handleError("Code is invalid");
    }
  }

}

import { UtilsService } from 'src/app/services/utils.service';
import { UserProfile, Timings } from './../../models/user-profile';
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, Validators, AbstractControl, FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { VaccynkService } from 'src/app/services/vaccynk.service';
import { REGEXP } from 'src/app/services/regexp';

@Component({
  selector: 'app-edit-pharmacy-info',
  templateUrl: './edit-pharmacy-info.component.html',
  styleUrls: ['./edit-pharmacy-info.component.scss']
})
export class EditPharmacyInfoComponent implements OnInit {

  userProfileForm: FormGroup = this.formBuilder.group({
    pharmacyName: ['', [Validators.required, Validators.pattern(this._regexp.NOT_ONLY_NUMBER_SPECIAL_CHAR)]],
    mobile: ['', [Validators.required, Validators.maxLength(10)]],
    faxNo: ['',Validators.required],
    email: ['',[Validators.required, Validators.email,Validators.pattern(this._regexp.EMAIL_REGEXP),Validators.pattern(this._regexp.NOT_ONLY_NUMBER_SPECIAL_CHAR)]],
    address : ['',Validators.required],
    state : ['',[Validators.required, Validators.pattern(this._regexp.NOT_ONLY_NUMBER_SPECIAL_CHAR)]],
    city:['',[Validators.required, Validators.pattern(this._regexp.NOT_ONLY_NUMBER_SPECIAL_CHAR)]] ,
    zip: ['',[Validators.required, Validators.maxLength(10)]],
    NCPDPNo: ['',Validators.required],
    NPINo: ['',Validators.required],
    pharmacistName: ['',[Validators.required, Validators.pattern(this._regexp.NOT_ONLY_NUMBER_SPECIAL_CHAR)]],
    pharmacistEmail: ['',[Validators.required, Validators.email,Validators.pattern(this._regexp.EMAIL_REGEXP)]],
    pharmacistNpiNumber: ['', Validators.required]
  });

  public submitted = false;
  public isLoading = false;
  public userProfile: UserProfile;
  public timings: Timings;

  get f() : {
    [key: string]: AbstractControl;
  }{ return this.userProfileForm.controls; }


  public handleAddressChange(address, formControl: string) {
    this.userProfileForm.get(formControl).setValue(address.formatted_address);
  }



  constructor(public dialog: MatDialog,
     private formBuilder: FormBuilder,
     private _regexp: REGEXP,
     private util: UtilsService,
     public dialogRef: MatDialogRef<EditPharmacyInfoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _vacService: VaccynkService
     ) { }

  ngOnInit(): void {
    console.log(this.data)                                    
    this.userProfile = JSON.parse(JSON.stringify(this.data));
    this.timings = JSON.parse(JSON.stringify(this.data.timings));
    this.userProfileForm.patchValue(this.userProfile);
  }

  
  onSubmit(): void {
    
  }
  
  cancel(){
    this.dialogRef.close();
  }
  save() {
    this.submitted = true;
    if(!this.userProfileForm.valid) {
      return;
    }
    this.isLoading = true;
    this.userProfile = this.userProfileForm.value;
    this._vacService.updateVaccineCenterInfo(this.userProfile).subscribe(res =>{
      this.util.showToaster("Pharmacy details updated  successfully!");
      this.isLoading = false;
      this.userProfile.timings = this.timings;
      this.dialogRef.close(this.userProfile);
    },err=>{
      this.isLoading = false;
      this.util.handleError(err.error.message);
    })
  }

}

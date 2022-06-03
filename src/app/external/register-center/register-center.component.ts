import { AuthService } from 'src/app/services/auth.service';
import { VerifyEmailIdComponent } from './../../shared/modals/verify-email-id/verify-email-id.component';
import { AppRoutes } from 'src/app/shared/models/app-routes';
import { UtilsService } from 'src/app/services/utils.service';
import { VaccynkService } from 'src/app/services/vaccynk.service';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { REGEXP } from 'src/app/services/regexp';

@Component({
  selector: 'app-register-center',
  templateUrl: './register-center.component.html',
  styleUrls: ['./register-center.component.scss']
})
export class RegisterCenterComponent implements OnInit {

  AppRoutes = AppRoutes;
  terms: FormControl = new FormControl(true, Validators.required);

  registerForm: FormGroup = this.formBuilder.group({
    pharmacyName : ['', [Validators.required,Validators.pattern(this._regexp.NOT_ONLY_NUMBER_SPECIAL_CHAR)]],
    mobile : ['',[Validators.required, Validators.maxLength(10), Validators.minLength(10)]],
    faxNo: ['',Validators.required],
    email: ['',[Validators.required, Validators.pattern(this._regexp.EMAIL_REGEXP),Validators.pattern(this._regexp.NOT_ONLY_NUMBER_SPECIAL_CHAR)]],
    address : ['',Validators.required],
    state : ['',[Validators.required,Validators.pattern(this._regexp.NOT_ONLY_NUMBER_SPECIAL_CHAR)]],
    city:['',[Validators.required,Validators.pattern(this._regexp.NOT_ONLY_NUMBER_SPECIAL_CHAR)]] ,
    zip: ['',[Validators.required]],
    NCPDPNo: ['',Validators.required],
    NPINo: ['',Validators.required],
    pharmacistName: ['',[Validators.required,Validators.pattern(this._regexp.NOT_ONLY_NUMBER_SPECIAL_CHAR)]],
    pharmacistEmail: ['',[Validators.required,Validators.email,Validators.pattern(this._regexp.EMAIL_REGEXP)]],
    pharmacistNpiNumber: ['',Validators.required ],
    stateLicenseNumber:['',Validators.required],
    deaNumber:['']
  });

  public submitted = false;
  public isLoading = false;
  public showMsg = false;
  get f() : {
    [key: string]: AbstractControl;
  }{ return this.registerForm.controls; }

  constructor(public dialog: MatDialog,public _vacService: VaccynkService,public util: UtilsService,
    private _regexp: REGEXP,
    private auth: AuthService,
    private formBuilder: FormBuilder) {}

  
  ngOnInit(): void {
  }

  onSubmit(): void {
    
    this.submitted = true;
    if (this.terms.value == false) {
      this.util.handleError("Please check terms and conditions.")
      return;
    }

    if(this.registerForm.valid) {
      this.requestOtp();
    }
   
  }

  // handleAddressChange(address) {
  //   this.registerForm.get('address').setValue(address.formatted_address);
  // }

  
  public handleAddressChange(address, formControl: string) {
    this.registerForm.get(formControl).setValue(address.formatted_address);

    if (formControl === 'address') {
      for (let comp of address.address_components) {
        if (!comp.types || comp.types.length == 0) continue;

        if (comp.types.findIndex((x) => x.toLowerCase() == 'locality') > -1) {
          console.log(comp);
          this.registerForm.get('city').setValue(comp.long_name);
        } else if (
          comp.types.findIndex(
            (x) => x.toLowerCase() == 'administrative_area_level_1'
          ) > -1
        ) {
          console.log(comp);
          this.registerForm.get('state').setValue(comp.long_name);
        } else if (
          comp.types.findIndex((x) => x.toLowerCase() == 'postal_code') > -1
        ) {
          this.registerForm.get('zip').setValue(comp.long_name);
        }
      }
    }
  }

 

  private requestOtp() {
    let payload={
      email: this.f.email.value
    };
    this.isLoading = true;
    this.auth.requestOtpForVacCenter(payload).subscribe(res => this.onRequestOtpSuccessful(res), err=> this.onRequestOtpFailed(err));
  }

  private onRequestOtpSuccessful(res) {
    console.log(res);
    this.isLoading = false;
    // console.log(`OTP sent successfully on ${this.f.email.value}`);
    this.util.showToaster(`OTP sent successfully on ${this.f.email.value}`);
    this.openVerifyEmailIdDialog();
  }


  showDiv = {
    previous : false,
    current : false,
    next : false
  }
  private onRequestOtpFailed(err) {
    console.log(err);
    this.isLoading = false;
    if(err.error.responseType == 'USER_EXISTS') {
      console.log(`${this.f.email.value} already exists`);
    }
    this.util.handleError(err.error.message);
    
  }


  openVerifyEmailIdDialog() {
    let dialogRef = this.dialog.open(VerifyEmailIdComponent, {
      width: '583px',
      data: this.registerForm.value
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if(result) {
        this.showMsg = true;
        // window scroll
        setTimeout(()=>{document.getElementById("alret-box")?.scrollIntoView({ behavior: 'smooth'});}, 100)

        this.registerForm.reset();
      }
      this.submitted = false;
    });

    
  }
}

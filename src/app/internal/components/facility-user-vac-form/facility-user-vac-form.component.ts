import { SignaturePreviewFacilityComponent } from './../../../shared/modals/signature-preview-facility/signature-preview-facility.component';
import { FacilityFormData } from 'src/app/shared/models/facility-form';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SignaturePad } from 'angular2-signaturepad';
import { Console } from 'console';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { map } from 'rxjs/operators';
import { REGEXP } from 'src/app/services/regexp';
import { UtilsService } from 'src/app/services/utils.service';
import { VaccynkService } from 'src/app/services/vaccynk.service';
import { AppRoutes } from 'src/app/shared/models/app-routes';
import { VaccinationFormData } from 'src/app/shared/models/vaccination-form';
import { ScrollToAnimationEasing, ScrollToOffsetMap } from '@nicky-lenaers/ngx-scroll-to';
import { ScrollToEvent } from '@nicky-lenaers/ngx-scroll-to/lib/scroll-to-event.interface';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-facility-user-vac-form',
  templateUrl: './facility-user-vac-form.component.html',
  styleUrls: ['./facility-user-vac-form.component.scss']
})
export class FacilityUserVacFormComponent implements OnInit{

  myDateValue: Date;
  today = new Date();
  public facilityFormData: FacilityFormData;
  covidConsentForm: FormGroup;
  public formStep: string = "FIRST";
  
  isVerifyLoader = false;
  isRejectLoader = false;
  ngxScrollToDestination: string;
  ngxScrollToEvent: ScrollToEvent;
  ngxScrollToDuration: number;
  ngxScrollToEasing: ScrollToAnimationEasing;
  ngxScrollToOffset: number;
  ngxScrollToOffsetMap: ScrollToOffsetMap;

  AppRoutes = AppRoutes;
  fromWhere: string;

  @ViewChild(SignaturePad) signaturePad: SignaturePad;
  public signaturePadOptions: Object = { // passed through to szimek/signature_pad constructor
    'canvasWidth': 300,
    'canvasHeight': 100,
    'minWidth': 1.5,
  };
  get f() { return this.covidConsentForm.controls; }

  constructor(private cdref: ChangeDetectorRef,
    private _regexp: REGEXP,
    public dialog: MatDialog,
    public activatedRoute: ActivatedRoute,
    private util: UtilsService,
    private ngxUiLoaderService: NgxUiLoaderService,
    private _router: Router, private _vacService: VaccynkService, private fb: FormBuilder) { }
  insCardFront: File | string = null;
  insCardBack: File | string = null;
  govIssuedId: File | string = null;
  signature: File | string = null;


  ngOnInit(): void {


    this.covidConsentForm = this.getBlankCovidVaccineForm();
    this.activatedRoute.paramMap
      .pipe(map(() => window.history.state)).subscribe(res => {
        this.loadDataByRoute(res);
      })

      

    // this.applyConditionalValidation();
    // this.onUninsuredTypeSelected();
    // this.onInsTypeSelected();
    this.util.disableFormGroupControls(this.covidConsentForm);
    this.handleUnisuredViewMode();

  }

  onScroll() {
    // visible height + pixel scrolled >= total height 
    var elmnt = document.getElementById("content");
    elmnt.scrollIntoView();
}
  

  handleUnisuredViewMode() {

    this.uinsuredControl.disable();
    if (this.covidConsentForm.get('uninsured.stateIdNumber').value) {
      this.uinsuredControl.setValue("stateIdNumber");
    }
    if (this.covidConsentForm.get('uninsured.driverLicenseNumber').value) {
      this.uinsuredControl.setValue("driverLicenseNumber");
    }
    if (this.covidConsentForm.get('uninsured.socialSecurityNumber').value) {
      this.uinsuredControl.setValue("socialSecurityNumber");
    }
    
  }
  toggleDestination() {
    this.ngxScrollToDestination = this.ngxScrollToDestination === 'destination-1' ? 'destination-2' : 'destination-1';
  }


  loadDataByRoute(res) {
    console.log("IN ROUTE")
    if (res?.from == AppRoutes.DOSE_ONE || res.from == AppRoutes.DOSE_TWO) {
      console.log("from dose one or two");
      this.loadVacFormDataByPatientId(res.patientId);
      this.fromWhere = res.from;
    } else if (res.from == AppRoutes.NEW_REQ || res.from == AppRoutes.REMINDER
      || res.from == AppRoutes.DOSE_HISTORY || res.from == AppRoutes.ADD_OTH_DOSE) {
      console.log("FROM new request")
      this.fromWhere = AppRoutes.NEW_REQ;

      this.loadVacFormData();

    } else {

      this._router.navigate([AppRoutes.ROOT, AppRoutes.DASHBOARD])

    }
  }

  loadVacFormData() {
    this.facilityFormData = this._vacService.getFacilityFormData();
    if (!this.facilityFormData) {
      this.switchRouting();
    }
    console.log(this.facilityFormData);

    this.covidConsentForm.patchValue(this.facilityFormData);
    this.cdref.detectChanges();

  }

  loadVacFormDataByPatientId(patientId: string) {
    this.ngxUiLoaderService.startLoader('vac-form-loader');
    this._vacService.getFacilityFormsByPatinetId(patientId).subscribe(res => {
      this.facilityFormData = res;
      console.log(this.facilityFormData)
      // don't patch image files. store it to the other variables.
      this.covidConsentForm.patchValue(this.facilityFormData);
    this.handleUnisuredViewMode();

      // then patch it back
      this.ngxUiLoaderService.stopLoader('vac-form-loader');

    },
      err => {
        console.log(err);
        this.util.handleError(err.error.message);
        this.ngxUiLoaderService.stopLoader('vac-form-loader');

      }
    );

  }

  verifyPatients(isVerified: boolean){
    if (isVerified) {
      this.isVerifyLoader = true;
    } else {
      this.isRejectLoader = true;
    }

    let payload = {
      isVerified: isVerified
    }

    this._vacService.verifyPatientDetails(this.facilityFormData._id, payload).subscribe(res =>{
      this._router.navigate([AppRoutes.ROOT, AppRoutes.FACILITIES, AppRoutes.NEW_REQ])
      if (isVerified) {
        this.util.showToaster("Form is verified")
        this.isVerifyLoader = false;
      } else {
        this.util.showToaster("Form is rejected.","warning")
        this.isRejectLoader = false;
      }
    }, err =>{
      this.util.handleError(err.error.message);
      if (isVerified) {
        this.isVerifyLoader = false;
      } else {
        this.isRejectLoader = false;
      }
     })
  }

  switchRouting() {
    switch (this.fromWhere) {
      case AppRoutes.NEW_REQ: {
        this._router.navigate([AppRoutes.ROOT, AppRoutes.FACILITIES])
        break;
      }
      case AppRoutes.DOSE_ONE: {
        this._router.navigate([AppRoutes.ROOT, AppRoutes.FACILITIES])
        break;
      }
      case AppRoutes.DOSE_TWO: {
        this._router.navigate([AppRoutes.ROOT, AppRoutes.FACILITIES])
        break;
      }
    }
  }

  ngAfterViewInit() {
    this.cdref.detectChanges();
  }

  // updateVacForm() {
  //   console.log(this.covidConsentForm.value);
  //   this.submitted = true;
  //   if (this.covidConsentForm.invalid) {
  //     let arr = this.util.findInvalidControlsRecursive(this.covidConsentForm);
  //     console.log(arr);
  //     this.util.handleError("Please check all fields");
  //     return;
  //   }
  //   this.isLoading = true;
  //   Object.assign(this.facilityFormData, this.covidConsentForm.value)
  //   console.log('000000000000', this.facilityFormData)



  //   this._vacService.updateVaccinationForm(this.facilityFormData).subscribe(
  //     res => {
  //       console.log(res);
  //       this.isLoading = false;
  //       this._vacService.storeVacFormData(null);
  //       this.switchRouting();
  //       this.util.showToaster("Your Form Updated Successfully!");

  //     }, err => {
  //       console.log(err);
  //       this.isLoading = false;
  //       this.util.handleError(err.error?.message);
  //     }
  //   )
  // }
  
  signatureBase64: string;
  drawComplete() {
    this.signatureBase64 = this.signaturePad.toDataURL();
    let file = this.util.base64ToFile(this.signaturePad.toDataURL(), 'signature')
    console.log(file)
    console.log(this.covidConsentForm.get('signature'));
    this.covidConsentForm.get('signature').setValue(file, { emitModelToViewChange: false });
    console.log(this.covidConsentForm.get('signature'));
    console.log(file);
    this.signaturePad.off();

  }

  uploadImage(event, formControl: string) {
    // let file: File = <File>event.target.files[0];
    // console.log(this.covidConsentForm.get(formControl).value);

    // this.covidConsentForm.get(formControl).patchValue(file, { emitModelToViewChange: false }); //setting file object to reactive form
    // console.log(this.covidConsentForm.get(formControl).value);
    // console.log(this.covidConsentForm.value)
  }
  onClearSignature() {
    // this.signaturePad?.clear();
    // this.signaturePad?.on()
    // this.covidConsentForm.get('signature').setValue('', { emitModelToViewChange: false });
    // this.signatureBase64 = null;
  }
  downloadImage( formControl: string) {
    console.log({
      formControl,
    })
    // switch (formControl) {
    //   case 'insCardFront': {
    //       let fileUrl = this.covidConsentForm.get('insCardFront').value;
    //       // window.location.href = file;
    //       this._vacService.downloadImage(fileUrl, formControl)
    //       // this._vacService.toDataURL(fileUrl, (data)=>{
    //       //   console.log(data);
    //       // });
    //     break;
    //   }
    //   case 'insCardBack': {
        
    //     break;
    //   }
    //   case 'govIssuedId': {
        
    //     break;
    //   }
    //   case 'signature': {
        
    //     break;
    //   }
    // }
    let fileUrl = this.covidConsentForm.get(formControl).value;
    // window.location.href = file;
    this.util.downloadImage(fileUrl, formControl)
    // this._vacService.fileDownloadFromServer(file.value)
  }
  deleteImage(formControl: string) {
    this.covidConsentForm.get(formControl).setValue("");
  }
  triggerScrollTo(){
    this._vacService.triggerScrollToSrvice();
  }
  onDateChange(dob: HTMLInputElement, formControl: string) {
    if (dob.value && formControl) {
      console.log('date changed')
      console.log(this.covidConsentForm.get(formControl).value);
      // this.covidConsentForm.get(formControl).setValue(dob.value);
      // console.log(this.covidConsentForm.get(formControl).value);
    }
  }

  onDateChangeDate(date: HTMLInputElement, formControl: string) {
    if (date.value && formControl) {
      console.log('date changed')
      // console.log(this.covidConsentForm.get(formControl).value);
      // this.covidConsentForm.get(formControl).setValue(date.value);
      // console.log(this.covidConsentForm.get(formControl).value);
    }
  }

  public handleAddressChange(address, formControl: string) {
    this.covidConsentForm.get(formControl).setValue(address.formatted_address);
  }
 


  // doseHistory() {
  //   this._router.navigateByUrl(`/${AppRoutes.USERS}/${AppRoutes.DOSE_HISTORY}`, { state: { from: AppRoutes.USER_VAC, patientId: this.facilityFormData.addedBy } });
  //   // this._router.navigate([AppRoutes.DOSE_HISTORY]);
  // }

  // addDose() {
  //   this._router.navigateByUrl(`/${AppRoutes.USERS}/${AppRoutes.ADD_OTH_DOSE}`, { state: { from: AppRoutes.USER_VAC, patientId: this.facilityFormData.addedBy, fromWhere: this.fromWhere } });
  // }

 

  // reminder() {
  //   // this._router.navigate([AppRoutes.REMINDER]);
  //   this._router.navigateByUrl(`/${AppRoutes.USERS}/${AppRoutes.REMINDER}`, { state: { from: AppRoutes.USER_VAC, patientId: this.vacFormData.addedBy, fromWhere: this.fromWhere } });
  // }
 


  //#region conditional-validations

  public onInsTypeSelected() {
    let insTypeSelected = this.covidConsentForm.get('insType').value;
    console.log(insTypeSelected)
    switch (insTypeSelected) {
      case 'prescriptioninsurance': {
        this.covidConsentForm.get('prescriptionInsurance.isPrimaryCardholder').setValidators([Validators.required]);
        this.covidConsentForm.get('prescriptionInsurance.cardHolderId').setValidators([Validators.required]);

        this.covidConsentForm.get('medicareFields').reset('');
        this.util.removeFormGroupValidators(<FormGroup>this.covidConsentForm.controls['medicareFields']);

        this.covidConsentForm.get('medicalIns').reset('');
        this.util.removeFormGroupValidators(<FormGroup>this.covidConsentForm.controls['medicalIns']);

        this.covidConsentForm.get('uninsured').reset('');
        this.util.removeFormGroupValidators(<FormGroup>this.covidConsentForm.controls['uninsured']);
        break;
      }
      case 'medicare': {
        this.covidConsentForm.get('medicareFields.patientAgeAbove65').setValidators([Validators.required]);
        this.covidConsentForm.get('medicareFields.mbi').setValidators([Validators.required]);

        this.covidConsentForm.get('prescriptionInsurance').reset('');
        this.util.removeFormGroupValidators(<FormGroup>this.covidConsentForm.controls['prescriptionInsurance']);

        this.covidConsentForm.get('medicalIns').reset('');
        this.util.removeFormGroupValidators(<FormGroup>this.covidConsentForm.controls['medicalIns']);

        this.covidConsentForm.get('uninsured').reset('');
        this.util.removeFormGroupValidators(<FormGroup>this.covidConsentForm.controls['uninsured']);
        break;
      }
      case 'medical': {
        this.covidConsentForm.get('medicalIns.isPrimaryCardholder').setValidators([Validators.required]);
        this.covidConsentForm.get('medicalIns.medicalInsProvider').setValidators([Validators.required]);
        this.covidConsentForm.get('medicalIns.cardHolderId').setValidators([Validators.required]);

        this.covidConsentForm.get('prescriptionInsurance').reset('');
        this.util.removeFormGroupValidators(<FormGroup>this.covidConsentForm.controls['prescriptionInsurance']);

        this.covidConsentForm.get('medicareFields').reset('');
        this.util.removeFormGroupValidators(<FormGroup>this.covidConsentForm.controls['medicareFields']);

        this.covidConsentForm.get('uninsured').reset('');
        this.util.removeFormGroupValidators(<FormGroup>this.covidConsentForm.controls['uninsured']);

        break;
      }
      case 'uninsured': {
        this.covidConsentForm.get('uninsured.isUninsured').setValidators([Validators.required]);

        this.covidConsentForm.get('prescriptionInsurance').reset('');
        this.util.removeFormGroupValidators(<FormGroup>this.covidConsentForm.controls['prescriptionInsurance']);

        this.covidConsentForm.get('medicareFields').reset('');
        this.util.removeFormGroupValidators(<FormGroup>this.covidConsentForm.controls['medicareFields']);

        this.covidConsentForm.get('medicalIns').reset('');
        this.util.removeFormGroupValidators(<FormGroup>this.covidConsentForm.controls['medicalIns']);

        break;
      }
    }
    this.cdref.detectChanges();
    console.log(this.covidConsentForm)
  }

  public uinsuredControl: FormControl = new FormControl('', Validators.required);
  public submitted = false;

  onUninsuredTypeSelected() {
    switch (this.uinsuredControl.value) {
      case 'socialSecurityNumber': {
        this.covidConsentForm.get('uninsured.stateIdNumber').reset('');
        this.covidConsentForm.get('uninsured.stateIdNumber').clearValidators();
        this.covidConsentForm.get('uninsured.stateIdNumber').updateValueAndValidity();

        this.covidConsentForm.get('uninsured.driverLicenseNumber').reset('');
        this.covidConsentForm.get('uninsured.driverLicenseNumber').clearValidators();
        this.covidConsentForm.get('uninsured.driverLicenseNumber').updateValueAndValidity();

        this.covidConsentForm.get('uninsured.socialSecurityNumber').setValidators([Validators.required]);
        this.covidConsentForm.get('uninsured.socialSecurityNumber').updateValueAndValidity();
        break;
      }
      case 'stateIdNumber': {
        this.covidConsentForm.get('uninsured.socialSecurityNumber').reset('');
        this.covidConsentForm.get('uninsured.socialSecurityNumber').clearValidators();
        this.covidConsentForm.get('uninsured.socialSecurityNumber').updateValueAndValidity();

        this.covidConsentForm.get('uninsured.driverLicenseNumber').reset('');
        this.covidConsentForm.get('uninsured.driverLicenseNumber').clearValidators();
        this.covidConsentForm.get('uninsured.driverLicenseNumber').updateValueAndValidity();

        this.covidConsentForm.get('uninsured.stateIdNumber').setValidators([Validators.required]);
        this.covidConsentForm.get('uninsured.stateIdNumber').updateValueAndValidity();
        break;
      }
      case 'driverLicenseNumber': {
        this.covidConsentForm.get('uninsured.socialSecurityNumber').reset('');
        this.covidConsentForm.get('uninsured.socialSecurityNumber').clearValidators();
        this.covidConsentForm.get('uninsured.socialSecurityNumber').updateValueAndValidity();

        this.covidConsentForm.get('uninsured.stateIdNumber').reset('');
        this.covidConsentForm.get('uninsured.stateIdNumber').clearValidators();
        this.covidConsentForm.get('uninsured.stateIdNumber').updateValueAndValidity();

        this.covidConsentForm.get('uninsured.driverLicenseNumber').setValidators([Validators.required]);
        this.covidConsentForm.get('uninsured.driverLicenseNumber').updateValueAndValidity();
        break;
      }
    }
    // this.cdref.detectChanges();

  }
  
  applyConditionalValidation() {

    this.uinsuredControl.setValue(this.covidConsentForm.get('uninsured.isUninsured').value);
    console.log("APPLIED CONDITIONAL VALIDATION")
    this.covidConsentForm.get('prescriptionInsurance.isPrimaryCardholder').valueChanges.subscribe(value => {
      console.log(value)
      value == 'No' ?
        this.covidConsentForm.get('prescriptionInsurance.dob').setValidators([Validators.required]) :
        this.covidConsentForm.get('prescriptionInsurance.dob').clearValidators();

      this.covidConsentForm.get('prescriptionInsurance.dob').updateValueAndValidity();
    })
    this.covidConsentForm.get('medicalIns.isPrimaryCardholder').valueChanges.subscribe(value => {
      console.log(value)
      value == 'No' ?
        this.covidConsentForm.get('medicalIns.dob').setValidators([Validators.required]) :
        this.covidConsentForm.get('medicalIns.dob').clearValidators();

      this.covidConsentForm.get('medicalIns.dob').updateValueAndValidity();
    })
    this.covidConsentForm.get('potentialContradiction.receivedDose').valueChanges.subscribe(value => {
      console.log(value)
      value == 'Yes' ?
        this.covidConsentForm.get('potentialContradiction.vaccineCompany').setValidators([Validators.required]) :
        this.covidConsentForm.get('potentialContradiction.vaccineCompany').clearValidators();

      this.covidConsentForm.get('potentialContradiction.vaccineCompany').updateValueAndValidity();

    })
  }

  //#endregion

  //#region blank form
  private getBlankCovidVaccineForm() {
    return this.fb.group(
      {
        _id: [''],
        firstname: ['', [Validators.required, Validators.pattern(this._regexp.NOT_ONLY_NUMBER_SPECIAL_CHAR), Validators.maxLength(50)]],
        lastname: ['', [Validators.required, Validators.pattern(this._regexp.NOT_ONLY_NUMBER_SPECIAL_CHAR), Validators.maxLength(50)]],
        dob: ['', Validators.required],
        gender: ['', Validators.required],
        address: ['', Validators.required],
        city: ['', [Validators.required, Validators.pattern(this._regexp.NOT_ONLY_NUMBER_SPECIAL_CHAR)]],
        state: ['', [Validators.required, Validators.pattern(this._regexp.NOT_ONLY_NUMBER_SPECIAL_CHAR)]],
        zip: ['', [Validators.required, Validators.maxLength(10)]],
        PCPname: ['', Validators.maxLength(50)],
        PCPmobile: ['', Validators.maxLength(10)],
        PCPfaxnumber: ['', Validators.maxLength(15)],
        PCPaddress: [''],
        PCPcity: [''],
        PCPstate: [''],
        PCPzip: ['', Validators.maxLength(10)],
        race: ['', Validators.required],
        ethnicity: ['', Validators.required],
        nextOfKin: this.fb.group({
          name: ['', [Validators.required, Validators.maxLength(50)]],
          mobile: ['', [Validators.required, Validators.maxLength(10)]],
          relationship: ['', [Validators.required, Validators.maxLength(50)]],
          address: ['', Validators.required],
        }),
        registrySharingIndicator: ['', Validators.required],
        patientInfo: this.fb.group({
          type: ['', Validators.required],
          doseCount: ['', Validators.required],
        }),
        insCardFront: [null],
        insCardBack: [null],
        govIssuedId: [null],
        // insuranceInfo: this.fb.group({
        // }),
        insType: ['', Validators.required],
        prescriptionInsurance: this.fb.group({
          isPrimaryCardholder: [''],
          dob: [''],
          cardHolderId: [''],
          rxGroupId: [''],
          bin: [''],
          pcn: [''],
        }),
        medicareFields: this.fb.group({
          patientAgeAbove65: [''],
          mbi: [''],
        }),
        medicalIns: this.fb.group({
          isPrimaryCardholder: [''],
          dob: [''],
          medicalInsProvider: [''],
          cardHolderId: [''],
          groupId: [''],
          payerId: [''],
        }),
        uninsured: this.fb.group({
          isUninsured: [''],
          socialSecurityNumber: [''],
          stateIdNumber: [''],
          driverLicenseNumber: [''],
        }),
        potentialContradiction: this.fb.group({
          sick: ['', [Validators.required]],
          receivedDose: ['', [Validators.required]],
          vaccineCompany: [''],
          hadSevereAllergy: ['', [Validators.required]],
          hadAllergyAfterDose: ['', [Validators.required]],
          hadAllergyAfterOtherDoseOrInjectable: ['', [Validators.required]],
          hadAllergyRelatedToPolyGlycol: ['', [Validators.required]],
          receivedDoseIn14Days: ['', [Validators.required]],
          receivedAntibodies: ['', [Validators.required]],
        }),
        potentialConsiderationFirst: this.fb.group({
          haveBleedingDisorder: ['', [Validators.required]],
          haveWeekImmuneSystem: ['', [Validators.required]],
          isPregOrBreastfeeding: ['', [Validators.required]],
        }),
        signature: [null, Validators.required],
        potentialConsiderationSecond: this.fb.group({
          date: ['', Validators.required],
          nameOfParent: [''],
          mobile: [''],
          relationship: [''],
        }),
        vaccineCenterId: [''],
        scheduleDate: [''],
        scheduleTime: [''],
      }
    );
  }
  Imgpreview() :void{
    const dialogRef = this.dialog.open(SignaturePreviewFacilityComponent, {
      width: '500px',
      data : this.facilityFormData.signature,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      
    });
  }
  //#endregion
}

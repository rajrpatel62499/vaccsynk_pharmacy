import { VerifyFacilityVaccinatorComponent } from '../../../shared/modals/verify-facility-vaccinator/verify-facility-vaccinator.component';
import { UtilsService } from 'src/app/services/utils.service';
import { DoseType } from './../../../shared/models/enums';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { VaccynkService } from 'src/app/services/vaccynk.service';
import { AppRoutes } from 'src/app/shared/models/app-routes';
import { DoseFormData } from 'src/app/shared/models/dose-form';
import { VaccinationForm, VaccinationFormData } from 'src/app/shared/models/vaccination-form';
import { SignaturePad } from 'angular2-signaturepad';
import { REGEXP } from 'src/app/services/regexp';
import { Vaccinator } from 'src/app/shared/models/vaccinator';
import { VerifyVaccinatorCodeComponent } from 'src/app/shared/modals/verify-vaccinator-code/verify-vaccinator-code.component';
import { MatDialog } from '@angular/material/dialog';
import { SignaturePreviewAdddoseComponent } from 'src/app/shared/modals/signature-preview-adddose/signature-preview-adddose.component';
@Component({
  selector: 'app-facility-add-other-dose',
  templateUrl: './facility-add-other-dose.component.html',
  styleUrls: ['./facility-add-other-dose.component.scss']
})
export class FacilityAddOtherDoseComponent implements OnInit  {
  AppRoutes = AppRoutes
  doseForms: DoseFormData;
  
  addDoseForm: FormGroup = this.getDefaultAddDoseForm()
  vacForm: VaccinationFormData;
  doseNumber: string;
  submitted = false
  vaccinators: Vaccinator[] = [];
  selectedVaccinator: Vaccinator;
  patientNumber:string;
  isLoading = false;
  today = new Date();
  fromWhere: AppRoutes;
  patientId: string;
  facilityId: string;

  public signaturePadOptions: Object = { // passed through to szimek/signature_pad constructor
    'canvasWidth': 500,
    'canvasHeight': 100,
    'minWidth': 1.5,
  };
  @ViewChild(SignaturePad) signaturePad: SignaturePad;

  constructor(private formBuilder: FormBuilder,
    private cdref: ChangeDetectorRef,
    private _regexp: REGEXP,
    private _router: Router,
    public dialog: MatDialog,
    public activatedRoute: ActivatedRoute,
    public util: UtilsService,
    public _vacService: VaccynkService) { }


  ngOnInit(): void {

    this.loadVaccinators();

    this.activatedRoute.paramMap
      .pipe(map(() => window.history.state)).subscribe(res => {
        this.loadWithRoutes(res);
      })

    this.activatedRoute.params.subscribe(console.log);
    console.log(this.activatedRoute.url);

    // this._vacService.getVacFormData().subscribe(res => {
    //   this.vacForm = res;      
    // })
  }
  showSignature(vaccinator) {
    this.selectedVaccinator = vaccinator;
  }
  loadWithRoutes(res) {
    console.log('Rushab Nreakar')
    console.log(res)
    // if(res.from == AppRoutes.USER_VAC) {
    if (res?.fromWhere == AppRoutes.DOSE_ONE || res.fromWhere == AppRoutes.DOSE_TWO || res.fromWhere == AppRoutes.NEW_REQ) {
      this.patientId = res.patientId;
      this.patientNumber = res.patientNumber;
      this.fromWhere = res.fromWhere;
      this.facilityId = res.facilityId;
      switch (res.fromWhere) {
      case AppRoutes.NEW_REQ: {
          this.doseNumber = res.dose;
          this.patientNumber = res.patientNumber
          break;
        }
        case AppRoutes.DOSE_ONE: {
          this.doseNumber = DoseType.SECOND;
          this.patientNumber = res.patientNumber
          break;
        }
        case AppRoutes.DOSE_TWO: {
          this.doseNumber = DoseType.OTHER;
          break;
        }
      }
    }
    // }
    // else {
    //   this._router.navigate([AppRoutes.ROOT, AppRoutes.DASHBOARD])
    // }
    console.log(res);
    
    console.log(this.doseNumber);
    console.log(this.patientId);
    console.log("patientIdpatientId",this.patientNumber);
    
  }
  loadVaccinators() {
    this.vaccinators.splice(0, this.vaccinators.length);
    this._vacService.getVaccinators().subscribe(res => {
      this.vaccinators = res;
      console.log(this.vaccinators);
    }, err => {
      console.log(err);
      this.util.handleError(err.error.message);
    })
  }
  verifyVacinatorCode(): void {
    let dialogRef = this.dialog.open(VerifyFacilityVaccinatorComponent, {
      width: '300px',
      height:'250px',           
      data: { doseForms: this.doseForms, vaccinator: this.selectedVaccinator }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result) {
        this.switchRouting();
      }
    });
  }

  drawComplete() {
    // let file = this.util.base64ToFile(this.signaturePad.toDataURL(), 'administrationSignature')
    // console.log(file)
    // console.log(this.addDoseForm.get('administrationSignature'));
    // this.addDoseForm.get('administrationSignature').setValue(file, { emitModelToViewChange: false });
    // console.log(this.addDoseForm.get('administrationSignature'));
    // console.log(file);
    // this.signaturePad.off();

  }

  uploadImage(event, formControl: string) {
    let file: File = <File>event.target.files[0];

    if (file.type == 'image/jpeg' || file.type == 'application/pdf' || file.type == 'image/png' || file.type == 'image/jpg') {
    } else {
       this.util.handleError("Please upload valid file type.!!")
      return;
    }
    if (file.size >= 10000000) {
      this.util.handleError("File size should be less thatn 10 MB")
      return
    }

    console.log(this.addDoseForm.get(formControl).value);

    this.addDoseForm.get(formControl).patchValue(file, { emitModelToViewChange: false }); //setting file object to reactive form
    console.log(this.addDoseForm.get(formControl).value);
    console.log(this.addDoseForm.value)
  }


  // onClearSignature() {
  //   this.signaturePad?.clear();
  //   this.signaturePad?.on()
  //   this.addDoseForm.get('administrationSignature').setValue('', { emitModelToViewChange: false });
  // }

  onDateChange(expDate: HTMLInputElement, formControl: string) {

    console.log('date selected', this.addDoseForm.get(formControl).value)

    this.cdref.detectChanges();

  }

  OnSubmit() {

    this.addDoseForm.patchValue({
      doseNumber: this.doseNumber,
      patientId: this.patientId,
      facilityId: this.facilityId

    })
    this.submitted = true;
    if (this.addDoseForm.invalid) {
      this.util.handleError("Please check all fields")
      let errors = this.util.findInvalidControlsRecursive(this.addDoseForm);
      console.log(errors);
      return;
    }
    this.isLoading = true;
    this.doseForms = this.addDoseForm.value;
    this.verifyVacinatorCode();
    // this._vacService.addDoseFormForFacility(this.addDoseForm.value).subscribe(
    //   res => {
    //     console.log(res);
    //     this.isLoading = false;
    //     this.util.showToaster("Dose Added Successfully!");
    //     this.switchRouting();
    //     // this._router.navigateByUrl(`${AppRoutes.ROOT}/${AppRoutes.USER_VAC}`, { state: { from : AppRoutes.ADD_OTH_DOSE}});
    //     console.log(this.addDoseForm);
    //   }, err => {
    //     console.log(err);
    //     this.isLoading = false;
    //     this.util.handleError(err.error?.message);
    //     console.log(this.addDoseForm);
    //   }
    // )
    // this._vacService.addDose(this.doseForms).subscribe(res =>{
  //   this._vacService.showToaster("Doses Inserts Successfully!");
    // })
  }

  switchRouting() {
    switch (this.fromWhere) {
      case AppRoutes.NEW_REQ: {
        let route =  this.doseNumber == DoseType.FIRST ? AppRoutes.DOSE_ONE : 
        this.doseNumber == DoseType.SECOND ? AppRoutes.DOSE_TWO : 
        this.doseNumber == DoseType.NONE ? AppRoutes.DOSE_ONE : AppRoutes.DOSE_ONE;
        this._router.navigate([AppRoutes.ROOT, AppRoutes.FACILITIES, route])
        break;
      }
      case AppRoutes.DOSE_ONE: {
        this._router.navigate([AppRoutes.ROOT, AppRoutes.FACILITIES, AppRoutes.DOSE_TWO])
        break;
      }
      case AppRoutes.DOSE_TWO: {
        this._router.navigate([AppRoutes.ROOT, AppRoutes.FACILITIES, AppRoutes.DOSE_TWO])
        break;
      }
    }
  }


  get f() { return this.addDoseForm.controls; }

  private getDefaultAddDoseForm() {
    return this.formBuilder.group({
      doseNumber: ['', Validators.required],
      patientId: [''],
      facilityId: [''],
      administrationDate: ['', [Validators.required]],
      vaccine: ['', [Validators.required, Validators.pattern(this._regexp.NOT_ONLY_NUMBER_SPECIAL_CHAR), Validators.maxLength(50)]],
      VISDate: ['', Validators.required],
      manufacturer: ['', [Validators.required, Validators.pattern(this._regexp.NOT_ONLY_NUMBER_SPECIAL_CHAR), Validators.maxLength(50)]],
      ndcNumber: ['', Validators.required],
      volume: ['', Validators.required],
      lot: ['', Validators.required],
      expDate: ['', Validators.required],
      route: ['', [Validators.required, Validators.maxLength(50)]],
      site: ['', Validators.required],
      patientTemp: ['', Validators.required],
      administrationName: ['', [Validators.required, Validators.pattern(this._regexp.NOT_ONLY_NUMBER_SPECIAL_CHAR), Validators.maxLength(50)]],
      patientNumber: ['', Validators.required],
      
      clinicInfo: this.formBuilder.group({
        clinicId: ['', Validators.required],
        name: ['', Validators.required],
        telephone: [''],
        storeNumber: [''],
        address: [''],
        city: [''],
        state: [''],
        zip: [''],
      })

    });
  }


  Imgpreview() :void{
    const dialogRef = this.dialog.open(SignaturePreviewAdddoseComponent, {
      width: '500px',
      data : this.selectedVaccinator.signature
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      
    });
  }

}

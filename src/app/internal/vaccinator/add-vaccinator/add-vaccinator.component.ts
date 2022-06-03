import { Vaccinator } from './../../../shared/models/vaccinator';
import { AppRoutes } from './../../../shared/models/app-routes';
import { finalize } from 'rxjs/operators';
import { VaccinatorDetailsComponent } from './../../../shared/modals/vaccinator-details/vaccinator-details.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { VaccynkService } from 'src/app/services/vaccynk.service';
import { REGEXP } from 'src/app/services/regexp';
import { Router } from '@angular/router';
import { UtilsService } from 'src/app/services/utils.service';
import * as moment from 'moment';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-add-vaccinator',
  templateUrl: './add-vaccinator.component.html',
  styleUrls: ['./add-vaccinator.component.scss']
})
export class AddVaccinatorComponent implements OnInit {

  addVaccinatorForm: FormGroup = this.getDefaultAddDoseForm();
  loader = false;
  AppRoutes = AppRoutes;

  constructor(private formBuilder: FormBuilder,
    public _vacService: VaccynkService,
    public dialog: MatDialog,
    private _regexp: REGEXP,
    private _router: Router,
    public util: UtilsService,
    ) { }

  ngOnInit(): void {
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

    console.log(this.addVaccinatorForm.get(formControl).value);
    this.addVaccinatorForm.get(formControl).patchValue(file, { emitModelToViewChange: false }); //setting file object to reactive form
    console.log(this.addVaccinatorForm.get(formControl).value);
    console.log(this.addVaccinatorForm.value)
  }

  onSumit() {
    this.submitted = true;
    if (this.addVaccinatorForm.invalid) {
      console.log(this.addVaccinatorForm.value);
      let arr = this.util.findInvalidControlsRecursive(this.addVaccinatorForm);
      console.log(arr);
      this.util.handleError("Please check all fields");
      return;
    }
    this.loader = true;

    let payload: Vaccinator = this.addVaccinatorForm.value;
    
    payload.CPRExpDate = moment(payload.CPRExpDate).format('MM/DD/YYYY').toString();
    payload.NPIExpDate = moment(payload.NPIExpDate).format('MM/DD/YYYY').toString();
    payload.LicenceExpDate = moment(payload.LicenceExpDate).format('MM/DD/YYYY').toString();
    
    this._vacService.addVaccinator(payload).pipe(finalize(() => { this.loader = false;})).subscribe(res =>{

      this.util.showToaster("Vaccinator added successfully.");
      this._router.navigate([AppRoutes.ROOT, AppRoutes.VACCINATOR])
    },
    (err)=>{
      this.util.handleError(err.error.message);
    })
  }

  get f() { return this.addVaccinatorForm.controls; }
  submitted =false;
  today = new Date();
  getDefaultAddDoseForm(){
    return this.formBuilder.group({
      firstname: ['',Validators.required],
      email: ['',[Validators.required, Validators.email,Validators.pattern(this._regexp.EMAIL_REGEXP)]],
      
      NPINumber: ['',Validators.required],
      NPIExpDate: ['',Validators.required],
      
      Licence: ['',Validators.required],
      LicenceExpDate: ['',Validators.required],

      CPRNumber: ['',Validators.required],
      CPRExpDate: ['',Validators.required],
      
      signature: ['',Validators.required],
    });
  }

}

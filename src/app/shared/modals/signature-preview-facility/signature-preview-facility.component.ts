import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { REGEXP } from 'src/app/services/regexp';
import { UtilsService } from 'src/app/services/utils.service';
import { VaccynkService } from 'src/app/services/vaccynk.service';
import { VaccinationFormData } from '../../models/vaccination-form';

@Component({
  selector: 'app-signature-preview-facility',
  templateUrl: './signature-preview-facility.component.html',
  styleUrls: ['./signature-preview-facility.component.scss']
})
export class SignaturePreviewFacilityComponent implements OnInit {

  public vacForms: VaccinationFormData;
  
  constructor( public dialogRef: MatDialogRef<SignaturePreviewFacilityComponent>,
    public dialog: MatDialog,
     private formBuilder: FormBuilder,
     private _regexp: REGEXP,
     private util: UtilsService,
    @Inject(MAT_DIALOG_DATA) public data: string,
    private _vacService: VaccynkService) { }

  ngOnInit(): void {  

    console.log(this.data)
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}

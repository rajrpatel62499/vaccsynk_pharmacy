import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { REGEXP } from 'src/app/services/regexp';
import { UtilsService } from 'src/app/services/utils.service';
import { VaccynkService } from 'src/app/services/vaccynk.service';
import { VaccinationFormData } from '../../models/vaccination-form';

@Component({
  selector: 'app-preview-signature-img',
  templateUrl: './preview-signature-img.component.html',
  styleUrls: ['./preview-signature-img.component.scss']
})
export class PreviewSignatureImgComponent implements OnInit {

  public vacForms: VaccinationFormData;
  
  constructor( public dialogRef: MatDialogRef<PreviewSignatureImgComponent>,
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

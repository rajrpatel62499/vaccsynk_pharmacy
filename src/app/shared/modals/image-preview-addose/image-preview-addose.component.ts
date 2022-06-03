import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { REGEXP } from 'src/app/services/regexp';
import { UtilsService } from 'src/app/services/utils.service';
import { VaccynkService } from 'src/app/services/vaccynk.service';
import { VaccinationFormData } from '../../models/vaccination-form';
import { Vaccinator } from '../../models/vaccinator';
import { PreviewSignatureImgComponent } from '../preview-signature-img/preview-signature-img.component';

@Component({
  selector: 'app-image-preview-addose',
  templateUrl: './image-preview-addose.component.html',
  styleUrls: ['./image-preview-addose.component.scss']
})
export class ImagePreviewAddoseComponent implements OnInit {

  selectedVaccinator: Vaccinator;

  
  constructor( public dialogRef: MatDialogRef<ImagePreviewAddoseComponent>,
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

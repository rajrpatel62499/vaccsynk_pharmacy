import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { REGEXP } from 'src/app/services/regexp';
import { UtilsService } from 'src/app/services/utils.service';
import { VaccynkService } from 'src/app/services/vaccynk.service';
import { Vaccinator } from '../../models/vaccinator';
import { ImagePreviewAddoseComponent } from '../image-preview-addose/image-preview-addose.component';

@Component({
  selector: 'app-signature-preview-adddose',
  templateUrl: './signature-preview-adddose.component.html',
  styleUrls: ['./signature-preview-adddose.component.scss']
})
export class SignaturePreviewAdddoseComponent implements OnInit {

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

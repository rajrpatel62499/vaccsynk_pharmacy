import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Vaccinator } from '../../models/vaccinator';

@Component({
  selector: 'app-vaccinator-details',
  templateUrl: './vaccinator-details.component.html',
  styleUrls: ['./vaccinator-details.component.scss']
})
export class VaccinatorDetailsComponent implements OnInit {
  public vaccineCenterData:Vaccinator;

  constructor(@Inject(MAT_DIALOG_DATA) public data:Vaccinator,public dialogRef: MatDialogRef<VaccinatorDetailsComponent>) { }

  ngOnInit(): void {
    console.log(this.data)
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

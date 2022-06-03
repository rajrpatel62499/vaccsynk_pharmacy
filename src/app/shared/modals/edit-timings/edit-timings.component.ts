import { UtilsService } from 'src/app/services/utils.service';
import { UserProfile } from 'src/app/shared/models/user-profile';
import { VaccynkService } from './../../../services/vaccynk.service';
import { DayInfo } from './../../models/user-profile';
import { DayOfWeek } from './../../models/enums';
import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Timings } from '../../models/user-profile';
import { NgForm } from '@angular/forms';

// dosePerDay(maxDose) >= dosePerSlot * slotCount 
@Component({
  selector: 'app-edit-timings',
  templateUrl: './edit-timings.component.html',
  styleUrls: ['./edit-timings.component.scss']
})
export class EditTimingsComponent implements OnInit {

  public timings: Timings
  public dayOfWeek = DayOfWeek;
  public selectedDay: number = 0;
  public isLoading = false;
  // selectedDayInfo: DayInfo;

  @ViewChild('f')
  form: NgForm;

  get slotCount() {
    if (this.selectedDayInfo.open && this.selectedDayInfo.close) {
      return (+this.selectedDayInfo?.close.split(":")[0] - +this.selectedDayInfo?.open.split(":")[0] ) * 2;
    }
    return 0;
  }

  get selectedDayInfo(): DayInfo {
    return this.timings[this.dayOfWeek[this.selectedDay]];
  }

  getSlotCount(dayInfo: DayInfo) {
    if (dayInfo.open && dayInfo.close) {
      return (+dayInfo.close.split(":")[0] - +dayInfo.open.split(":")[0] ) * 2;
    }
    return 1;
  }
  get canSave() {
    let errors: DayInfo[] = [];
    Object.keys(this.timings).forEach(key =>{
      const day = (this.timings[key] as DayInfo);
      if(!(day.maxDose >= this.userProfile.dosePerSlot * this.getSlotCount(day))) {
        errors.push(day);
      } 
    })
    console.log(errors);
    
    if (errors.length > 0) {
      return false;
    } else {
      return true;
    }
  }

  

  public times = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24];
  // public selecteDayInfo: DayInfo;
  constructor( public dialogRef: MatDialogRef<EditTimingsComponent>,
    @Inject(MAT_DIALOG_DATA) public userProfile: UserProfile,
    private util: UtilsService,
    private _vacService: VaccynkService
    ) { }
    

  ngOnInit(): void {    
    // this.timings = this.data;
    this.timings = JSON.parse(JSON.stringify(this.userProfile.timings));
    // this.selecteDayInfo = this.timings["Monday"];
    this.selectedDay = this.dayOfWeek.Monday;
    console.log(this.timings);
  }

  cancel(): void {
    this.dialogRef.close();
  }
  get f() { return this.selectedDay; }

  daySelected(day) {
    this.selectedDay = day;
    console.log(this.selectedDay)
    console.log(this.dayOfWeek[this.selectedDay]);
    // this.selectedDayInfo = this.timings[this.dayOfWeek[this.selectedDay]];
    // console.log(this.selecteDayInfo);

  }

  fromTimeChanged() {
    let close = (this.timings[this.dayOfWeek[this.selectedDay]] as DayInfo).close 
    let open = (this.timings[this.dayOfWeek[this.selectedDay]] as DayInfo).open 
    let maxDose = (this.timings[this.dayOfWeek[this.selectedDay]] as DayInfo).maxDose 
    if (+open == 24) {
      close = "24";
    } else {
      close = (+open + 1).toString();
    }
    if (this.util.isNullOrEmpty(maxDose)) {
      maxDose = 1;
    }
    (this.timings[this.dayOfWeek[this.selectedDay]] as DayInfo).close = close;
    (this.timings[this.dayOfWeek[this.selectedDay]] as DayInfo).open = open;
    (this.timings[this.dayOfWeek[this.selectedDay]] as DayInfo).maxDose = maxDose;
  }

  save() {
    
    console.log(this.timings);
    console.log(this.form.form.invalid);

    const errors = this.checkValidations();
    if (errors) {
      console.log(errors);
      this.util.handleError("Please check all the fields");
      return;
    }
    
    this.isLoading = true;
    // isClosed: this.userProfile.isClosed,
    // Object.keys(this.timings).forEach(key =>{
    //   delete this.timings[key].slots;
    // })
    this._vacService.updateVaccineCenterTimings({
      dosePerSlot: this.userProfile.dosePerSlot,
      timings: this.timings
    }).subscribe(res =>{
      this.util.showToaster("Timings Updated Successfully!");
      localStorage.setItem('updateProfile', 'true');
      this.isLoading = false;
      this.dialogRef.close(this.timings);
    },err=>{
      this.isLoading = false;
      this.util.handleError(err.error.message);
    })

  }

 

public restrictNumeric(e) {
  let input;
  if (e.metaKey || e.ctrlKey) {
    return true;
  }
  if (e.which === 32) {
   return false;
  }
  if (e.which === 0) {
   return true;
  }
  if (e.which < 33) {
    return true;
  }
  input = String.fromCharCode(e.which);
  return !!/[\d\s]/.test(input);
 }

  checkValidations() {
    let errors = []
    Object.entries(this.timings).forEach(x =>{
      let key = x[0];
      let value: DayInfo = x[1];
      if (!this.util.isNullOrEmpty(value.open)) {
        if (this.util.isNullOrEmpty(value.close) || this.util.isNullOrEmpty(value.maxDose)) {
          errors.push(key);
        }
      }
    })
    if ( errors.length == 0) {
      return false;
    } else {
      return errors;
    }
  }

}

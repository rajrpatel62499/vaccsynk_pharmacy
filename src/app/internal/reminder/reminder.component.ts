import { AuthService } from './../../services/auth.service';
import { FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { AppRoutes } from 'src/app/shared/models/app-routes';
import { DayOfWeek, DoseType } from 'src/app/shared/models/enums';
import { UserProfile } from 'src/app/shared/models/user-profile';
import { ReminderPayload } from 'src/app/shared/models/reminder';
import { VaccynkService } from 'src/app/services/vaccynk.service';
import { UtilsService } from 'src/app/services/utils.service';



export interface Timings {
  Monday: SlotInfo;
  Tuesday: SlotInfo;
  Wednesday: SlotInfo;
  Thursday: SlotInfo;
  Friday: SlotInfo;
  Saturday: SlotInfo;
  Sunday: SlotInfo;
}

export interface SlotInfo {
  maxDose?: number;
  open: string;
  close: string;
}

@Component({
  selector: 'app-reminder',
  templateUrl: './reminder.component.html',
  styleUrls: ['./reminder.component.scss']
})
export class ReminderComponent implements OnInit {

  constructor(private router: Router,
    public activatedRoute: ActivatedRoute,
    private _auth: AuthService,
    private _vacService: VaccynkService,
    private util: UtilsService
    ) { }
  doseNumber: string;
  patientId: string;
  submitted = false;
  isLoading = false;

  availableSloats: SlotInfo[] = [];
  selectedSloat: SlotInfo;
  selectedVacSlotInfo: SlotInfo;
  today = new Date();

  date = new FormControl('', Validators.required);
  other = new FormControl('');
  time: string;
  

  userProfile:UserProfile;
  ngOnInit(): void {

    this.activatedRoute.paramMap
    .pipe(map(() => window.history.state)).subscribe(res => {

      if(res.from == AppRoutes.USER_VAC) {
          if(res?.fromWhere == AppRoutes.DOSE_ONE || res.fromWhere == AppRoutes.DOSE_TWO || res.fromWhere == AppRoutes.NEW_REQ) {
            this.patientId = res.patientId;
    
            switch (res.fromWhere) {
              case AppRoutes.NEW_REQ: {
                this.doseNumber = DoseType.FIRST;
                break;
              }
              case AppRoutes.DOSE_ONE: {
                this.doseNumber = DoseType.SECOND;
                break;
              }
              case AppRoutes.DOSE_TWO: {
                this.doseNumber = DoseType.OTHER;
                break;
              }
            }
            console.log(this.doseNumber);
          } 
      }
      else {
        this.router.navigate([AppRoutes.ROOT, AppRoutes.DASHBOARD])
      }
    })

    this._auth.getUserProfileData().subscribe(res=>{
      this.userProfile = res;
      console.log(this.userProfile);
    })
  }

  selectSloat(sloat: SlotInfo) {
      this.selectedSloat = sloat;
      this.time = `${sloat.open}:00 - ${sloat.close}:00`;
  }

  onDateChange() {
    let selectedDate: Date = new Date(this.date.value);
      console.log(selectedDate)
    // let availableSlotInfo:SlotInfo
    this.selectedVacSlotInfo = null;
    this.selectedVacSlotInfo = this.userProfile.timings[DayOfWeek[selectedDate?.getUTCDay()]?.toString()];
    if(this.selectedVacSlotInfo) {
      this.availableSloats = this.getTimeSlotsBySlotInfo(this.selectedVacSlotInfo);
    }
  

  }

  OnSubmit() {
    let reminderPayload: ReminderPayload ={
      date: this.date.value,
      other: this.other.value,
      time: this.time,
      dose: this.doseNumber,
      patientId: this.patientId
    };
     
    console.log(reminderPayload)
   
    this.submitted = true;
    if(this.date.invalid && !this.time) {
      this.util.handleError("Please select date and time")
      return;
    }

    this.isLoading = true;
    this._vacService.setReminder(reminderPayload).subscribe(res =>{
      this.util.showToaster("Reminder set successfully");
    //  this.router.navigateByUrl(`${AppRoutes.ROOT}/${AppRoutes.USER_VAC}`, { state: { from : AppRoutes.REMINDER}});
      this.goBack();
      this.isLoading = false;
    }, err=>{
      console.log(err);
      this.isLoading = false;
      this.util.handleError(err.error.message);
    })
  }

  goBack() {
    this.util.goBack();
    // this.router.navigateByUrl(`${AppRoutes.ROOT}/${AppRoutes.USER_VAC}`, { state: { from : AppRoutes.REMINDER}});
  }

  private getTimeSlotsBySlotInfo(availableSlotInfo: SlotInfo): SlotInfo[] {
    const open= availableSlotInfo?.open?.split(" ");
    const close= availableSlotInfo?.close?.split(" ");
    if(!open && !close) {
      return [];
    }
    const openingTime = Number.parseFloat(open[0]);
    const closingTime = Number.parseFloat(close[0]);
    console.log(openingTime);
    console.log(closingTime);
    let availableSloats: {open:string, close:string}[] = [];
    // for(let i=openingTime; i< 45; i++) {
    //   // console.log(i %13);
    //   if( i % 13 == closingTime) {
    //     break;
    //   }
    //   ( i % 13) != 0 ? availableSloats.push({open: `${i % 13}`, close: `${(i % 13 + 1 == 13) ? 1 : (i % 13 + 1)}`}) : '';
    // }
    for (let i = openingTime; i < 45; i++) {
      console.log(i);
      if (i % 25 == closingTime) {
          break;
      }
      (i % 25) != 0 ? availableSloats.push({ open: `${(i - 12) > 0 ? (i - 12) : i}`, close: `${(i - 12) >= 0 ? (i + 1 - 12) : i + 1}` }) : '';
     
    }
    console.log(availableSloats);
    return availableSloats;
  }

}

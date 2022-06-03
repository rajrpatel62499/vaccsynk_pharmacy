import { EditPharmacyInfoComponent } from './../../shared/modals/edit-pharmacy-info/edit-pharmacy-info.component';
import { AuthService } from 'src/app/services/auth.service';
import { UserProfile } from './../../shared/models/user-profile';
import { Component, OnInit } from '@angular/core';
import { VaccynkService } from 'src/app/services/vaccynk.service';
import { MatDialog } from '@angular/material/dialog';
import { EditTimingsComponent } from 'src/app/shared/modals/edit-timings/edit-timings.component';
import { UtilsService } from 'src/app/services/utils.service';
import { ChangePasswordModalComponent } from 'src/app/shared/modals/change-password-modal/change-password-modal.component';
import { FormControl, Validators } from '@angular/forms';
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {


  editDosePerSlot = false;
  previeousDosePerSlot: number;
  userProfile:UserProfile;

  constructor(private _auth: AuthService,
    private _vacService: VaccynkService,
    public dialog: MatDialog,private util: UtilsService) { }
    
  ngOnInit(): void {
    this._auth.getUserProfileData().subscribe(res=>{
      this.userProfile = res;
      console.log(this.userProfile);
    })

    
  }
//   changePosition() {
//     this.dialog.updatePosition({ top: '50px', left: '50px' });
// }
  editTimings(): void {
    if (this.util.isNullOrEmpty(this.userProfile.dosePerSlot)) {
      this.util.handleError("Please update the max dose per slot.");
      return;
    }

    if (this.userProfile.dosePerSlot <=0 ) {
      this.util.handleError("maxdose per slot should be greather than 0");
      return;
    }
    let dialogRef = this.dialog.open(EditTimingsComponent, {
      
      data : this.userProfile
    }).addPanelClass("edit-timing-modal-main");
    
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log(result);
      if(result){
        this.userProfile.timings = result;
        this._auth.setUserProfileData(this.userProfile);
      }
    });
  }

  editProfile() {
    let dialogRef = this.dialog.open(EditPharmacyInfoComponent, {
      width: '1000px',
      data : this.userProfile
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log(result);
      if(result){
        this.userProfile = result;
        this._auth.setUserProfileData(this.userProfile);
      }
    });
  }

  changePassword(){
    const dialogRef = this.dialog.open(ChangePasswordModalComponent).addPanelClass("modal-change-password");

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  editDosePerSlotFunc() {
    this.previeousDosePerSlot = this.userProfile.dosePerSlot;
    this.editDosePerSlot = !this.editDosePerSlot;
  }

  save() {

    if (this.util.isNullOrEmpty(this.userProfile.dosePerSlot)) {
      this.util.handleError("maxdose is required!")
      return;
    }
    if (this.userProfile.dosePerSlot <=0 ) {
      this.util.handleError("maxdose per slot should be greather than 0");
      return;
    }

    let dialogRef = this.dialog.open(EditTimingsComponent, {
      
      data : this.userProfile
    }).addPanelClass("edit-timing-modal-main");
    
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log(result);
      if(result){
        this.userProfile.timings = result;
        this.editDosePerSlot = !this.editDosePerSlot;
        this._auth.setUserProfileData(this.userProfile);
      } else {
        this.userProfile.dosePerSlot = this.previeousDosePerSlot;
        this.editDosePerSlot = !this.editDosePerSlot;
      }
    });
    // this._vacService.updateVaccineCenterTimings({
    //   dosePerSlot: this.userProfile.dosePerSlot,
    //   timings: this.userProfile.timings
    // }).subscribe(res =>{
    //   this.util.showToaster("Dose Per Slot Updated Successfully!");
    //   this.editDosePerSlot = !this.editDosePerSlot;
    // },err=>{
    //   this.util.handleError(err.error.message);
    //   this.editDosePerSlot = !this.editDosePerSlot;

    // })
  }
}

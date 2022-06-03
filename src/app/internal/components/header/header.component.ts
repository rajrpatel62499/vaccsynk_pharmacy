import { UserProfile } from './../../../shared/models/user-profile';
import { AuthService } from './../../../services/auth.service';
import { VaccynkService } from 'src/app/services/vaccynk.service';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {BroadcastMessageComponent} from '../../../shared/modals/broadcast-message/broadcast-message.component'
import { Router } from '@angular/router';
import { AppRoutes } from 'src/app/shared/models/app-routes';
import { ChangeDetectorRef } from '@angular/core';
import { colorSets } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  public userProfileData: UserProfile;
  isLoading=false;
  AppRoutes=AppRoutes
  constructor(public dialog: MatDialog,
     private _auth: AuthService,
     private _router: Router,
     private cdref: ChangeDetectorRef
     ) { }

  ngOnInit(): void {
    this.isLoading=false;
    console.log("Header Called")
   this._auth.getUserProfileData().subscribe(res => {
    this.isLoading=true;
     console.log("User Data Fetched")
     if(res) {
       this.userProfileData = res;
       this.isLoading=false;
       console.log(this.userProfileData)
       this.cdref.detectChanges();
       this.isLoading=false;
     }
   })
  }

  openDialog(): void {
    let dialogRef = this.dialog.open(BroadcastMessageComponent, {
      width: '500px',
      height:'330px'
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  logout() {
    this._auth.logoutUser();
    // this._router.navigate(['/',AppRoutes.LOGIN]);
  }


}

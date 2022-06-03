import { VaccynkService } from 'src/app/services/vaccynk.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {
  notificationList:any[];
  isLoading=false;

  constructor(public vacService:VaccynkService) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.vacService.notificationForPharmacy().subscribe(res=>{
      this.isLoading = false;
      this.notificationList = res
     console.log('Notification For Patient', this.notificationList)
 })
  }

}

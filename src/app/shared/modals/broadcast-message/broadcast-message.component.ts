import { UtilsService } from 'src/app/services/utils.service';
import { VaccynkService } from 'src/app/services/vaccynk.service';
import { Component, OnInit,Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-broadcast-message',
  templateUrl: './broadcast-message.component.html',
  styleUrls: ['./broadcast-message.component.scss']
})
export class BroadcastMessageComponent implements OnInit {
  isLoading=false;

  message: FormControl = new FormControl("");

  constructor( 
    private _vacService: VaccynkService,
    private util: UtilsService,
    public dialogRef: MatDialogRef<BroadcastMessageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this._vacService.notificationForPatient().subscribe(res=>{
      if(res=!undefined){
        console.log("Notification Done",res);
      }
      else{
        this.util.handleError("You are not allowed to do this..")
      }
    })
  }


  
  onNoClick(): void {
    this.dialogRef.close();
  }

  broadCastMessage() {
    this.isLoading=true;
    this._vacService.broadcastMessage(this.message.value).subscribe(res=>{
      this.isLoading=false;
        this.util.showToaster("Message is Broadcasted!");
        this.dialogRef.close();
    },
    err=>{
      this.isLoading=false;
        this.util.handleError(err.error.message);
    })
  }
  
}

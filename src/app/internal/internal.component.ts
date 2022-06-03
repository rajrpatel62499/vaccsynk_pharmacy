import { AppRoutes } from './../shared/models/app-routes';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { Component, OnInit } from '@angular/core';
import { UtilsService } from '../services/utils.service';

@Component({
  selector: 'app-internal',
  templateUrl: './internal.component.html',
  styleUrls: ['./internal.component.scss'],
})
export class InternalComponent implements OnInit {
  constructor(private _auth: AuthService, private router: Router,private util:UtilsService) {}

  ngOnInit(): void {
    if (this.router.url == AppRoutes.ROOT) {
      this.router.navigate([AppRoutes.ROOT, AppRoutes.DASHBOARD]);
    }
    console.log('Intenal called');
    
    this.util.isUserData.subscribe((data)=>{
      if(!data){
        this.getUserData();
      }
    })
  }

  getUserData(){
    this._auth.getUserProfile().subscribe((res) => {
      this._auth.setUserProfileData(res.data);
    });
  }
}

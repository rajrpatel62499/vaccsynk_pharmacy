import { Component, OnInit } from '@angular/core';
import { AppRoutes } from 'src/app/shared/models/app-routes';

@Component({
  selector: 'app-users-header',
  templateUrl: './users-header.component.html',
  styleUrls: ['./users-header.component.scss']
})
export class UsersHeaderComponent implements OnInit {

  navLinks = [
    { path: `/${AppRoutes.USERS}/${AppRoutes.NEW_REQ}`, label: "New Request"},
    { path: `/${AppRoutes.USERS}/${AppRoutes.DOSE_ONE}`, label: "1st Dose"},
    { path: `/${AppRoutes.USERS}/${AppRoutes.DOSE_TWO}`, label: "2nd Dose"}
  ];

  constructor() { }

  ngOnInit() {
  }

}

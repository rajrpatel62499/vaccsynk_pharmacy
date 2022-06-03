import { Component, OnInit } from '@angular/core';
import { AppRoutes } from 'src/app/shared/models/app-routes';

@Component({
  selector: 'app-facilities-header',
  templateUrl: './facilities-header.component.html',
  styleUrls: ['./facilities-header.component.scss']
})
export class FacilitiesHeaderComponent implements OnInit {

  navLinks = [
    { path: `/${AppRoutes.FACILITIES}/${AppRoutes.NEW_REQ}`, label: "New Request"},
    { path: `/${AppRoutes.FACILITIES}/${AppRoutes.DOSE_ONE}`, label: "Dose One"},
    { path: `/${AppRoutes.FACILITIES}/${AppRoutes.DOSE_TWO}`, label: "Dose Two"}
  ];

  constructor() { }

  ngOnInit(): void {
  }

}

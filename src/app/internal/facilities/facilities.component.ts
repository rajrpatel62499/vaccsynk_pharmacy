import { VaccynkService } from 'src/app/services/vaccynk.service';
import { FacilityCenter } from 'src/app/shared/models/facility-center';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppRoutes } from 'src/app/shared/models/app-routes';

@Component({
  selector: 'app-facilities',
  templateUrl: './facilities.component.html',
  styleUrls: ['./facilities.component.scss']
})
export class FacilitiesComponent implements OnInit {

  AppRoutes = AppRoutes;
  editFacility: FacilityCenter = null;

  constructor(
    private router: Router,
    public vacService: VaccynkService 
  ) { 
    // this.router.navigate([AppRoutes.FACILITIES, AppRoutes.NEW_REQ])
    this.vacService.setEditedFacility(null); // to show all facilities first. || clear the edited facility.
  };

  ngOnInit(): void {
  }

}

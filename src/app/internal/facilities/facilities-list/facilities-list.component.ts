import { AppRoutes } from './../../../shared/models/app-routes';
import { VaccynkService } from './../../../services/vaccynk.service';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FacilityCenter } from 'src/app/shared/models/facility-center';
import { finalize, map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-facilities-list',
  templateUrl: './facilities-list.component.html',
  styleUrls: ['./facilities-list.component.scss']
})
export class FacilitiesListComponent implements OnInit {

  facilityCenters: FacilityCenter[] = [];
  selectedFacilityCenter: FacilityCenter;
  AppRoutes = AppRoutes;

  isLoading = false;

  // @Output('onSelect') 
  // onSelect = new EventEmitter<FacilityCenter>();

  constructor(public vacService: VaccynkService) { }

  ngOnInit(): void {
    this.loadFacilityCenters();
  }

  loadFacilityCenters(value?: string) {
    this.isLoading = true;
    this.facilityCenters.splice(0, this.facilityCenters.length);
    this.vacService.getFacilityCenters(value)
    
      .pipe(
        tap((res) => { this.facilityCenters = res; }),
        tap((res) => console.log(res)),
        finalize(()=>{ this.isLoading = false})
      )
      .subscribe();
      
  }



  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    console.log(filterValue);
    this.loadFacilityCenters(filterValue);
  }

  loadFacilityCenterById(facilityCenterId: string) {
    this.vacService.getFacilityCenters().pipe(
      map(x => x.filter(y => y._id == facilityCenterId))
    ).subscribe(res => {
      this.facilityCenters = res;
      console.log('facilityCenter Id', res)

      if (res) {
        this.selectedFacilityCenter = res[0];

      }
    })
  }

}

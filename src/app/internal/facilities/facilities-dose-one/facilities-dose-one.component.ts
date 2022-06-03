import { Router } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import Swal from "sweetalert2";
import { DoseForm, DoseFormData } from 'src/app/shared/models/dose-form';
import { AppRoutes } from 'src/app/shared/models/app-routes';
import { DoseParams } from 'src/app/shared/models/params';
import { VaccynkService } from 'src/app/services/vaccynk.service';
import { DoseType } from 'src/app/shared/models/enums';
import { UtilsService } from 'src/app/services/utils.service';
import { VaccinationFormData } from 'src/app/shared/models/vaccination-form';
import { FacilityCenter } from 'src/app/shared/models/facility-center';
import * as moment from 'moment';


const cols = {

  PATIENT_NAME : 'Patient Name',
  PH_NO: 'Phone Number',
  MANUFACTURE:'Manufature',   
  LOT_NO:'Lot No',    
  DATE_TIME : 'Date & Time',
  CLINICAL_SITE:'Clinical Site',            
  ACTIONS: 'Actions'
  
}

@Component({
  selector: 'app-facilities-dose-one',
  templateUrl: './facilities-dose-one.component.html',
  styleUrls: ['./facilities-dose-one.component.scss']
})
export class FacilitiesDoseOneComponent implements OnInit  {
  displayedColumns: string[] =[  'created_at','patient_number','patient_name', 'phone_number', 'manufactured', 'lot_no', 'clinical_site', 'actions'];
  public doseParams: DoseParams = new DoseParams();  
  isLoading = false;
  public totalFormsInDb: number = 0;
  dataSource: MatTableDataSource<DoseFormData> = new MatTableDataSource<DoseFormData>();
  // selection = new SelectionModel<DoseForm>(true, []);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  doseForms: DoseFormData[] = [];

  constructor(private vaccynkService: VaccynkService, public router:Router, private util: UtilsService) {
    this.loadDoseForms();
  }
  ngOnInit(): void {
  }

  
  loadDoseForms(){
    const editedFacility: FacilityCenter = this.vaccynkService.getEditedFacility();
    if (this.util.isNullOrEmpty(editedFacility)) {
      this.util.handleError("OOPs something went wrong!");
    }

    this.isLoading = true;
    this.doseParams.type = DoseType.FIRST;
    this.doseForms.splice(0, this.doseForms.length);
    this.dataSource = new MatTableDataSource(this.doseForms);

    this.doseParams.facilityId = editedFacility._id;
    this.vaccynkService.getDosesForFacility(this.doseParams).subscribe(res=>{
      this.isLoading = false;
      this.doseForms= res.data;
      console.log(res);
      this.totalFormsInDb = +res.totalForm;
      this.dataSource=new MatTableDataSource(this.doseForms)
    }, err => {
      this.isLoading = false;
      console.log(err);
    })
}

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    // this.dataSource.filter = filterValue.trim().toLowerCase();
    this.doseParams.value = filterValue.trim().toLowerCase();
    this.loadDoseForms();
    // this.isLoading = false ;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


  // dateChange(event) {
  //   let date = new Date(event.value);
  //   if(event.value) {
  //     console.log(`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}` );
  //     // this.doseParams.date = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  //     this.doseParams.date = date.toISOString();
      
  //     this.loadDoseForms();
  //     this.isLoading = false ;
  //   }else {
  //     this.doseParams.date = '';
  //     this.loadDoseForms();
  //   }
  // }

  dateChange(event) {
    let date = new Date(event.value);
    if(event.value) {
      console.log(`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`);
      // this.vaccineCenterPar.date = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
      this.doseParams.date = moment(date).format('MM/DD/YYYY');
      this.loadDoseForms();
      // this.isLoading = false;
    }else {
      this.doseParams.date = '';
      this.loadDoseForms();
    }

  }

  pageChange(event: PageEvent) {
    console.log(event);
    this.doseParams.limit = event.pageSize;
    this.doseParams.pageNumber = event.pageIndex;
    this.loadDoseForms();
    // this.isLoading = false ;
  }


  onDeleteForm(dose: DoseFormData) {

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })
    
    swalWithBootstrapButtons.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel! ',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.vaccynkService.deleteVacinationDoseById(dose._id).subscribe(res => {
          console.log(res);
          this.loadDoseForms();
          swalWithBootstrapButtons.fire(
            'Deleted!',
            'dose has been deleted.',
            'success'
          )
        }, err=>{
          this.util.handleError(err.error.message);
        })
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire(
          'Cancelled',
          // 'Your imaginary file is safe :)',
          'error'
        )
      }
    })
    
    
  }


  onUpdateForm(dose: DoseFormData) {  
    this.router.navigateByUrl(`/${AppRoutes.FACILITIES}/${AppRoutes.DOSE_ONE}/${AppRoutes.FACILITY_USER_VAC}`, { state: { from : AppRoutes.DOSE_ONE, patientId: dose.patientId._id, facilityId: dose.facilityId}});
    // this.router.navigate([AppRoutes.ROOT,AppRoutes.USER_VAC]);
  }

  onAddDose(dose: DoseFormData) {
    
    this.router.navigateByUrl(`/${AppRoutes.FACILITIES}/${AppRoutes.DOSE_ONE}/${AppRoutes.FACILITY_ADD_OTH_DOSE}`, { state: { fromWhere : AppRoutes.DOSE_ONE, patientId: dose.patientId._id, facilityId: dose.facilityId,patientNumber: dose.patientNumber }  });
  }

  onDoseHistory(dose: DoseFormData) {
    this.router.navigateByUrl(`/${AppRoutes.FACILITIES}/${AppRoutes.DOSE_ONE}/${AppRoutes.FACILITY_DOSE_HISTORY}`, { state: { fromWhere : AppRoutes.DOSE_ONE, patientId: dose.patientId._id, facilityId: dose.facilityId}  });

  }
  // /** Whether the number of selected elements matches the total number of rows. */
  // isAllSelected() {
  //   const numSelected = this.selection.selected.length;
  //   const numRows = this.dataSource.data.length;
  //   return numSelected === numRows;
  // }

  // /** Selects all rows if they are not all selected; otherwise clear selection. */
  // masterToggle() {
  //   this.isAllSelected() ?
  //       this.selection.clear() :
  //       this.dataSource.data.forEach(row => this.selection.select(row));
  // }

  /** The label for the checkbox on the passed row */
  // checkboxLabel(row?: UserData): string {
  //   if (!row) {
  //     return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
  //   }
  //   return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  // }
}

import { FacilityFormParams } from './../../../shared/models/params';
import { FacilityCenter } from './../../../shared/models/facility-center';
import { UtilsService } from 'src/app/services/utils.service';
import { Router } from '@angular/router';
import { VaccinationFormParams } from '../../../shared/models/params';
import { VaccynkService } from '../../../services/vaccynk.service';
import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { VaccinationForm, VaccinationFormData } from 'src/app/shared/models/vaccination-form';


import Swal from "sweetalert2";
import { AppRoutes } from 'src/app/shared/models/app-routes';
import { query } from '@angular/animations';
import { FacilityForm, FacilityFormData } from 'src/app/shared/models/facility-form';
import { ReqeustType } from 'src/app/shared/models/enums';
import * as moment from 'moment';
const cols = {
  DATE_TIME : 'Date & Time',
  PATIENT_NAME : 'Patient Name',
  DOB : 'Date of Birth',
  PH_NO: 'Phone Number',
  EMAIL: 'Email ID',
  ADDRESS: 'Address',
  ACTIONS: 'Actions'
}

@Component({
  selector: 'app-facilities-new-request',
  templateUrl: './facilities-new-request.component.html',
  styleUrls: ['./facilities-new-request.component.scss']
})
export class FacilitiesNewRequestComponent implements OnInit {

  name = 'Angular 6';
  tab : any = 'tab1';
  tab1 : any
  tab2 : any
  tab3 : any
  Clicked : boolean
  requestTypes = ReqeustType;
  
  displayedColumns: string[] = ['created_at','status', 'dose', 'patient_name','phone_number', 'email', 'address' , 'actions'];
  public facilityParams: FacilityFormParams = new FacilityFormParams();  
  public totalFormsInDb: number = 0;
  dataSource: MatTableDataSource<FacilityFormData> = new MatTableDataSource<FacilityFormData>();
  selection = new SelectionModel<FacilityForm>(true, []);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  isLoading = false;
  facilityForms: FacilityFormData[] = [];

  constructor(private _vacService: VaccynkService, public router:Router, private util: UtilsService) {
    this.loadVaccineForms();
  }
  ngOnInit(): void {
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    // this.dataSource.filter = filterValue.trim().toLowerCase();
    this.facilityParams.value = filterValue.trim().toLowerCase();
    this.loadVaccineForms();
    // this.isLoading = false ;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  loadVaccineForms() {
    const editedFacility: FacilityCenter = this._vacService.getEditedFacility();
    if (this.util.isNullOrEmpty(editedFacility)) {
      this.util.handleError("OOPs something went wrong!");
    }

    this.isLoading = true;
    this.facilityForms.splice(0, this.facilityForms.length);
    this.dataSource = new MatTableDataSource(this.facilityForms);

    this.facilityParams.facilityId = editedFacility._id;

    
    this._vacService.getFacilityForms(this.facilityParams).subscribe(res => {
      this.facilityForms = res.data;
      console.log(this.totalFormsInDb)
      this.totalFormsInDb = +res.totalForm;
      this.isLoading = false;
      // this.vaccinationForms.push(...res);
      this.dataSource = new MatTableDataSource(this.facilityForms);
      // this.dataSource.paginator = this.paginator;
      // this.dataSource.sort = this.sort;
      console.log(this.facilityForms);
    }, err => {
      this.isLoading = false;
      console.log(err);
    })
  }

  onClick(check){
    //    console.log(check);
        if(check==1){
          this.tab = 'tab1';
        }else if(check==2){
          this.tab = 'tab2';
        }else{
          this.tab = 'tab3';
        }    
      
    }



  // dateChange(event) {
  //   let date = new Date(event.value);
  //   if(event.value) {
  //     console.log(`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}` );
  //     // this.vacineParams.date = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  //     this.facilityParams.date = date.toISOString();
  //     this.loadVaccineForms();
  //     this.isLoading = false ;
  //   }else {
  //     this.facilityParams.date = '';
  //     this.loadVaccineForms();
  //   }
  // }


  dateChange(event) {
    let date = new Date(event.value);
    if(event.value) {
      console.log(`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`);
      // this.vaccineCenterPar.date = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
      this.facilityParams.date = moment(date).format('MM/DD/YYYY');
      this.loadVaccineForms();
      // this.isLoading = false;
    }else {
      this.facilityParams.date = '';
      this.loadVaccineForms();
    }

  }
  pageChange(event: PageEvent) {
    console.log(event);
    this.facilityParams.limit = event.pageSize;
    this.facilityParams.pageNumber = event.pageIndex;
    this.facilityForms.splice(0, this.facilityForms.length);
    this.loadVaccineForms();
    // this.isLoading = false ;
  }

  // onAppointmentTypeChange(appointmentType: string) {
  //   this.facilityParams.appointmentType = appointmentType;
  //   if(appointmentType == 'clear')
  //   {
  //     this.facilityParams.appointmentType = null;      
  //   }
  //   this.loadVaccineForms();
  // }

  onDeleteForm(form: FacilityFormData) {
    console.log(form);
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
        this._vacService.deleteVacinationFormById(form._id).subscribe(res => {
          console.log(res);
          this.loadVaccineForms();
          swalWithBootstrapButtons.fire(
            'Deleted!',
            "deleted successfully !",
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
          'error'
        )
      }
    })
    
    
  }
  onUpdateForm(vacForm: FacilityFormData ) {
    this._vacService.storeFacilityFormData(vacForm)
    console.log(vacForm);
    // this.router.navigate([AppRoutes.ROOT,AppRoutes.USER_VAC]);
    this.router.navigateByUrl(`/${AppRoutes.FACILITIES}/${AppRoutes.NEW_REQ}/${AppRoutes.FACILITY_USER_VAC}`, { state: { from : AppRoutes.NEW_REQ}});
    
  }
  
  onAddDose(vacForm: FacilityFormData) {
    
    this.router.navigateByUrl(`/${AppRoutes.FACILITIES}/${AppRoutes.NEW_REQ}/${AppRoutes.FACILITY_ADD_OTH_DOSE}`,
     { state: { fromWhere : AppRoutes.NEW_REQ, patientId: vacForm.patientId._id, facilityId: vacForm.facilitiesBy, dose: vacForm.dose, patientNumber:vacForm.patientId.patientNumber}  });
  }

}

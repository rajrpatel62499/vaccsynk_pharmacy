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
import * as moment from 'moment';
import { ReqeustType } from 'src/app/shared/models/enums';
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
  selector: 'app-new-request',
  templateUrl: './new-request.component.html',
  styleUrls: ['./new-request.component.scss']
})
export class NewRequestComponent implements OnInit{

  AppRoutes = AppRoutes;

  name = 'Angular 6';
  tab : any = 'tab1';
  tab1 : any
  tab2 : any
  tab3 : any
  Clicked : boolean
  
  requestTypes = ReqeustType;
  displayedColumns: string[] = ['created_at','status','dose', 'patient_name','phone_number', 'email', 'address' , 'actions'];
  public vacineParams: VaccinationFormParams = new VaccinationFormParams();  
  public totalFormsInDb: number = 0;
  dataSource: MatTableDataSource<VaccinationFormData> = new MatTableDataSource<VaccinationFormData>();
  selection = new SelectionModel<VaccinationForm>(true, []);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  isLoading = false;
  vaccinationForms: VaccinationFormData[] = [];

  constructor(private _vacService: VaccynkService, public router:Router, private util: UtilsService) {
    this.loadVaccineForms();
  }
  ngOnInit(): void {
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    // this.dataSource.filter = filterValue.trim().toLowerCase();
    this.vacineParams.value = filterValue.trim().toLowerCase();
    this.loadVaccineForms();
    // this.isLoading = false ;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  loadVaccineForms() {
    this.isLoading = true;
    this.vaccinationForms.splice(0, this.vaccinationForms.length);
    this.dataSource = new MatTableDataSource(this.vaccinationForms);
    this._vacService.getVacinationForms(this.vacineParams).subscribe(res => {
      this.vaccinationForms = res.data;
      console.log(this.totalFormsInDb)
      this.totalFormsInDb = +res.totalForm;
      this.isLoading = false;
      // this.vaccinationForms.push(...res);
      this.dataSource = new MatTableDataSource(this.vaccinationForms);
      // this.dataSource.paginator = this.paginator;
      // this.dataSource.sort = this.sort;
      console.log('this.vaccinationForms');
      console.log(this.vaccinationForms);
    }, err => {
      this.isLoading = false;
      console.log(err);
    })
  }

  // onClick(check){
  //   //    console.log(check);
  //       if(check==1){
  //         this.tab = 'tab1';
  //       }else if(check==2){
  //         this.tab = 'tab2';
  //       }else{
  //         this.tab = 'tab3';
  //       }    
      
  //   }



  // dateChange(event) {
  //   let date = new Date(event.value);
  //   if(event.value) {
  //     console.log(`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}` );
  //     // this.vacineParams.date = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  //     this.vacineParams.date = moment(date).format("MM/DD/YYYY");
 
      
  //     // this.loadVaccineForms();
  //     this.loadVaccineForms();
  //     this.isLoading = false;
  //   }else {
  //     this.vacineParams.date = '';
  //     this.loadVaccineForms();
  //   }
  // }

  dateChange(event) {
    let date = new Date(event.value);
    if(event.value) {
      console.log(`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`);
      // this.vaccineCenterPar.date = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
      this.vacineParams.date = moment(date).format('MM/DD/YYYY');
      this.loadVaccineForms();
      // this.isLoading = false;
    }else {
      this.vacineParams.date = '';
      this.loadVaccineForms();
    }

  }
  pageChange(event: PageEvent) {
    console.log(event);
    this.vacineParams.limit = event.pageSize;
    this.vacineParams.pageNumber = event.pageIndex;
    this.vaccinationForms.splice(0, this.vaccinationForms.length);
    this.loadVaccineForms();
    // this.isLoading = false;
    
  }

  // onAppointmentTypeChange(appointmentType: string) {
  //   this.vacineParams.appointmentType = appointmentType;
  //   if(appointmentType == 'clear')
  //   {
  //     this.vacineParams.appointmentType = null;      
  //   }
  //   this.loadVaccineForms();
  // }

  onDeleteForm(form: VaccinationFormData) {
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
  onUpdateForm(vacForm: VaccinationFormData) {
    this._vacService.storeVacFormData(vacForm)
    console.log(vacForm);
    // this.router.navigate([AppRoutes.ROOT,AppRoutes.USER_VAC]);
    this.router.navigateByUrl(`/${AppRoutes.USERS}/${AppRoutes.NEW_REQ}/${AppRoutes.USER_VAC}`, { state: { from : AppRoutes.NEW_REQ}});
    
  }
  
  onAddDose(vacForm: VaccinationFormData) {
    
    this.router.navigateByUrl(`/${AppRoutes.USERS}/${AppRoutes.NEW_REQ}/${AppRoutes.ADD_OTH_DOSE}`,
     { state: { fromWhere : AppRoutes.NEW_REQ, patientId: vacForm.addedBy, dose: vacForm.dose ,
       patientNumber: vacForm.patientId.patientNumber}  });
  }

}

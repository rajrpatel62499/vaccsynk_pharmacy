import { Vaccinator } from 'src/app/shared/models/vaccinator';
import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { UtilsService } from 'src/app/services/utils.service';
import { VaccynkService } from 'src/app/services/vaccynk.service';
import { VaccinatorDetailsComponent } from 'src/app/shared/modals/vaccinator-details/vaccinator-details.component';
import { AppRoutes } from 'src/app/shared/models/app-routes';
import { VaccinationFormParams } from 'src/app/shared/models/params';
import { VaccinationForm, VaccinationFormData } from 'src/app/shared/models/vaccination-form';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-vaccinator',
  templateUrl: './vaccinator.component.html',
  styleUrls: ['./vaccinator.component.scss']
})
export class VaccinatorComponent implements OnInit {

  AppRoutes = AppRoutes;

  
  displayedColumns: string[] = ['pass_code', 'name','email', 'NPInumber', 'license' , 'cprnumber','actions'];
  // public totalFormsInDb: number = 0;
  dataSource: MatTableDataSource<Vaccinator> = new MatTableDataSource<Vaccinator>();

  isLoading = false;
  vaccinators: Vaccinator[] = [];
  search: string = ''; 

  constructor(public dialog: MatDialog,private _vacService: VaccynkService, public router:Router, private util: UtilsService) {
    this.loadVacciantors();
  }
  ngOnInit(): void {
  }

  openDialog(vaccinator: Vaccinator): void {
    let dialogRef = this.dialog.open(VaccinatorDetailsComponent, {
      width: '750px',
      data : vaccinator,
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    // this.dataSource.filter = filterValue.trim().toLowerCase();
    this.search = filterValue.trim().toLowerCase();
    this.loadVacciantors();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  loadVacciantors() {
    this.isLoading = true;
    this.vaccinators.splice(0, this.vaccinators.length);
    this.dataSource = new MatTableDataSource(this.vaccinators);
    this._vacService.getVaccinators(this.search).subscribe(res => {
      this.vaccinators = res;
      this.isLoading = false;
      this.dataSource = new MatTableDataSource(this.vaccinators);
      console.log(this.vaccinators);
    }, err => {
      this.isLoading = false;
      console.log(err);
    })
  }


  onDeleteForm(vaccinator: Vaccinator) {
    console.log(vaccinator);
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
        this._vacService.deleteVaccinatorById(vaccinator._id).subscribe(res => {
          console.log(res);
          this.loadVacciantors();
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

  addVaccinator(){
    this.router.navigate([AppRoutes.ROOT,AppRoutes.VACCINATOR,AppRoutes.ADD_VACCINATOR]);

  }
  onUpdateForm(vacForm: VaccinationFormData) {
    this._vacService.storeVacFormData(vacForm)
    console.log(vacForm);
    // this.router.navigate([AppRoutes.ROOT,AppRoutes.USER_VAC]);
    this.router.navigateByUrl(`/${AppRoutes.USERS}/${AppRoutes.NEW_REQ}/${AppRoutes.USER_VAC}`, { state: { from : AppRoutes.NEW_REQ}});
    
  }
  
  // onAddDose(vacForm: VaccinationFormData) {
    
  //   this.router.navigateByUrl(`/${AppRoutes.USERS}/${AppRoutes.NEW_REQ}/${AppRoutes.ADD_OTH_DOSE}`, { state: { fromWhere : AppRoutes.NEW_REQ, patientId: vacForm.addedBy}  });
  // }

}

import { AddVaccinatorComponent } from './add-vaccinator/add-vaccinator.component';
import { AppRoutes } from 'src/app/shared/models/app-routes';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VaccinatorComponent } from './vaccinator.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '', children: [
      {
        path: '', component: VaccinatorComponent,
      },
      {
        path: AppRoutes.ADD_VACCINATOR, component: AddVaccinatorComponent,
        data: { breadcrumb: { label: 'Add Vaccinator'} }
      }
    ]
  }
]

@NgModule({
  declarations: [VaccinatorComponent, AddVaccinatorComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class VaccinatorModule { }

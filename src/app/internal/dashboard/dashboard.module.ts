import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { Routes, RouterModule } from '@angular/router';
import { ChartsModule } from 'ng2-charts';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { DatepickerModule, BsDatepickerModule } from 'ngx-bootstrap/datepicker';


const routes: Routes = [
  {
      path: '', children: [
          {
              path: '',
              component: DashboardComponent,
              data: {title: 'DashBoard'},
          }
           
      ]
  }
];


@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,ChartsModule, NgxChartsModule,
    BsDatepickerModule.forRoot(),
    DatepickerModule.forRoot(),
    
  ]
})
export class DashboardModule { }

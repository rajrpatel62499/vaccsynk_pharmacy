import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { NotificationComponent } from './notification.component';


const routes: Routes = [
  {
      path: '', children: [
          {
              path: '',
              component: NotificationComponent,
              data: {title: 'Notification'},
          }
           
      ]
  }
];
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class NotificationModule { }

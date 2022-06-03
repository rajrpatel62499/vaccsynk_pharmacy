import { AppRoutes } from './../../shared/models/app-routes';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Routes, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  AppRoutes = AppRoutes;
  constructor(
    private router: Router,
  ) { this.router.navigate([AppRoutes.USERS, AppRoutes.NEW_REQ])};

  ngOnInit() {

  }
}

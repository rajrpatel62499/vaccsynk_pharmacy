import { AuthService } from './../../../services/auth.service';
import { VaccynkService } from 'src/app/services/vaccynk.service';
import { Component, OnInit } from '@angular/core';
import { AppRoutes } from 'src/app/shared/models/app-routes';
import $ from "jquery";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  AppRoutes=AppRoutes;
  constructor(public vacService: VaccynkService, public auth: AuthService) { }

  ngOnInit(): void {
    $("#menu-toggle").click(function (e) {
      e.preventDefault();
      $("#wrapper").toggleClass("toggled");
  });

  $(".close-nav-bar").click(function (e) {
    e.preventDefault();
    $("#wrapper").toggleClass("toggled");
  });
  
  }

}

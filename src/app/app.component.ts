import { Component } from '@angular/core';
import {NgbDropdownConfig} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'covid-data-client';
  navbarOpen = false;
  constructor(private config: NgbDropdownConfig){
    config.autoClose = false;
  }
  toggleNavbar() {
    this.navbarOpen = !this.navbarOpen;
  }
}

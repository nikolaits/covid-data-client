import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GlobaldataComponent } from './globaldata/globaldata.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from '@danielmoncada/angular-datetime-picker';
import { ExportAsModule } from 'ngx-export-as';
import { NgChartjsModule } from 'ng-chartjs';
import { CountryComponent } from './country/country.component';
import { CountriesComponent } from './countries/countries.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { HistoryComponent } from './history/history.component';
import { ReportsComponent } from './reports/reports.component';

@NgModule({
  declarations: [
    AppComponent,
    GlobaldataComponent,
    CountryComponent,
    CountriesComponent,
    NotificationsComponent,
    HistoryComponent,
    ReportsComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    OwlDateTimeModule, 
    OwlNativeDateTimeModule,
    ExportAsModule,
    NgChartjsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

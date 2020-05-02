import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {GlobaldataComponent} from "./globaldata/globaldata.component"
import { CountryComponent } from './country/country.component';
import { CountriesComponent } from './countries/countries.component';
import { HistoryComponent } from './history/history.component';
import { ReportsComponent } from './reports/reports.component';

const routes: Routes = [
  { path: '', component: GlobaldataComponent},
  { path: 'country', component: CountryComponent},
  { path: 'countries', component: CountriesComponent},
  { path: 'history', component:HistoryComponent},
  { path: 'reports', component:ReportsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

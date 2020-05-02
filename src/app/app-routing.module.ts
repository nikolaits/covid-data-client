import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {GlobaldataComponent} from "./globaldata/globaldata.component"
import { CountryComponent } from './country/country.component';
import { CountriesComponent } from './countries/countries.component';

const routes: Routes = [
  { path: '', component: GlobaldataComponent},
  { path: 'country', component: CountryComponent},
  { path: 'countries', component: CountriesComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

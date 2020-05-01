import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {GlobaldataComponent} from "./globaldata/globaldata.component"

const routes: Routes = [
  { path: '', component: GlobaldataComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

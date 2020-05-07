import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../global.service';
import { getDateFormatted, saveToPDF, CountryData, compare, reduceCompare, countryHeadercells } from '../helper';


@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.css']
})
export class CountryComponent implements OnInit {

  public items: Array<CountryData> = [];
  public countries: Array<CountryData>=[];
  public country: string = "USA";
  public sorttype: string = "desc";
  public selectedS:string = "cases"
  public loading=false;
  public headercells:Array<any> = countryHeadercells;
  constructor(private globalService: GlobalService) { }

  ngOnInit(): void {
    let d = new Date();
    d.setHours(d.getHours()-1);
    d.setMinutes(0);
    let d2 = new Date();
    d2.setHours(23);
    d2.setMinutes(59);
    let sdate = getDateFormatted(d);
    let edate = getDateFormatted(d2);
    this.globalService.getCountriesData({ startdate: sdate, enddate: edate}).subscribe((data: any) => {
      if (data.status === 200) {
        if (data.body) {
          let arrayResult = data.body;
          arrayResult.sort(compare("asc", "country"));
          const result = arrayResult.reduce(reduceCompare("country"), []);
          this.countries = result.filter(( obj:CountryData ) =>{
            return obj.country !== 'World';
          });
        }
      }

    }, e => { console.log("ERROR: ", e.status); });
  }
  public savePDF() {
    const filename = this.country + "_data" + new Date().getTime() + ".pdf";
    saveToPDF("#contryTableElementId", this.country, filename,'landscape', 'a3');
  }
  public getForceData() {
    this.loading = true;
    let d = new Date();
    d.setHours(0);
    d.setMinutes(0);
    let d2 = new Date();
    d2.setHours(23);
    d2.setMinutes(59);
    let sdate = getDateFormatted(d);
    let edate = getDateFormatted(d2);
    this.globalService.getCountryDataForce({ startdate: sdate, enddate: edate, country:this.country }).subscribe((data: any) => {
      if (data.status === 200) {
        this.items = [];
        if (data.body) {
          let arrayResult = data.body;
          arrayResult.sort(compare(this.sorttype, this.selectedS));
          this.items = arrayResult;
          this.loading = true;
        }
      }

    }, e => { console.log("ERROR: ", e.status); });
  }
  public sortBy(args){
    this.selectedS = args;
    this.sorttype=='asc' ? this.sorttype='desc' : this.sorttype='asc';
    if(args!='datetime'){
      this.items.sort(compare(this.sorttype, this.selectedS))
      
    }else{
      this.items.sort(compare(this.sorttype, this.selectedS));
    }
  }
  public selectChange(args:string){
    this.loading = true;
    this.country = args;
    let d = new Date();
    d.setHours(0);
    d.setMinutes(0);
    let d2 = new Date();
    d2.setHours(23);
    d2.setMinutes(59);
    let sdate = getDateFormatted(d);
    let edate = getDateFormatted(d2);
    this.globalService.getCountryData({ startdate: sdate, enddate: edate, country:this.country }).subscribe((data: any) => {
      if (data.status === 200) {
        if (data.body) {
          let arrayResult = data.body;
          arrayResult.sort(compare(this.sorttype, this.selectedS));
          this.items = arrayResult;
          this.loading = false;
        }
      }

    }, e => { console.log("ERROR: ", e.status); });
  }
}

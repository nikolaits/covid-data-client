import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../global.service';
import { getDateFormatted, saveToPDF, CountryData } from '../helper';


@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.css']
})
export class CountryComponent implements OnInit {

  public items: Array<CountryData> = []
  public countries: Array<CountryData>=[]
  public country: string = "USA";
  public sorttype: string = "asc";
  public selectedS:string = "datetime"
  public loading=false;
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
          arrayResult.sort((a, b) => {
            let adateinfo = a.datetime.split(" ");
            let adate = adateinfo[0].split("-");
            let atime = adateinfo[1].split(":");
            let bdateinfo = b.datetime.split(" ");
            let bdate = bdateinfo[0].split("-");
            let btime = bdateinfo[1].split(":");
            if (new Date(bdate[0], parseInt(bdate[1]) - 1, bdate[2], btime[0], btime[1]).getTime() > new Date(adate[0], parseInt(adate[1]) - 1, adate[2], atime[0], atime[1]).getTime()) {
              return 1;
            } else if (new Date(bdate[0], parseInt(bdate[1]) - 1, bdate[2], btime[0], btime[1]).getTime() < new Date(adate[0], parseInt(adate[1]) - 1, adate[2], atime[0], atime[1]).getTime()) {
              return -1;
            }
            return 0;
          });
          let result = arrayResult.filter(obj => {
            return obj.datetime.includes(arrayResult[0].datetime.slice(0, -3))
          })
          result.sort((a, b)=>{
            if (a.country>b.country) {
              return 1;
            } else if (a.country<b.country) {
              return -1;
            }
            return 0;
          })
          this.countries = result.filter(( obj:CountryData ) =>{
            return obj.country !== 'World';
          });
        }
      }

    }, (e) => { console.log("ERROR: ", e.status); });
  }
  public savePDF() {
    const filename = this.country + "_data" + new Date().getTime() + ".pdf"
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
          arrayResult.sort(function (a, b) {
            let adateinfo = a.datetime.split(" ");
            let adate = adateinfo[0].split("-");
            let atime = adateinfo[1].split(":");
            let bdateinfo = b.datetime.split(" ");
            let bdate = bdateinfo[0].split("-");
            let btime = bdateinfo[1].split(":");
            if (new Date(bdate[0], parseInt(bdate[1]) - 1, bdate[2], btime[0], btime[1]).getTime() > new Date(adate[0], parseInt(adate[1]) - 1, adate[2], atime[0], atime[1]).getTime()) {
              return 1;
            } else if (new Date(bdate[0], parseInt(bdate[1]) - 1, bdate[2], btime[0], btime[1]).getTime() < new Date(adate[0], parseInt(adate[1]) - 1, adate[2], atime[0], atime[1]).getTime()) {
              return -1;
            }
            return 0;
          });
          this.items = arrayResult;
          this.loading = true;
        }
      }

    }, (e) => { console.log("ERROR: ", e.status); });
  }
  public sortBy(args){
    this.selectedS = args;
    if(args!='datetime'){
      this.items.sort((a,b)=>{
        if ( a[args] < b[args] ){
          return this.sorttype=='asc'? -1 : 1;
        }
        if ( a[args] > b[args] ){
          return this.sorttype=='asc'? 1 : -1;
        }
        return 0;
      })
      
    }else{
      this.items.sort( (a, b) =>{
        let adateinfo = a.datetime.split(" ");
        let adate = adateinfo[0].split("-");
        let atime = adateinfo[1].split(":");
        let bdateinfo = b.datetime.split(" ");
        let bdate = bdateinfo[0].split("-");
        let btime = bdateinfo[1].split(":");
        if (new Date(parseInt(bdate[0]), parseInt(bdate[1]) - 1, parseInt(bdate[2]), parseInt(btime[0]), parseInt(btime[1])).getTime() > new Date(parseInt(adate[0]), parseInt(adate[1]) - 1, parseInt(adate[2]), parseInt(atime[0]), parseInt(atime[1])).getTime()) {
          return this.sorttype=='asc'? -1 : 1;
        } else if (new Date(parseInt(bdate[0]), parseInt(bdate[1]) - 1, parseInt(bdate[2]), parseInt(btime[0]), parseInt(btime[1])).getTime() < new Date(parseInt(adate[0]), parseInt(adate[1]) - 1, parseInt(adate[2]), parseInt(atime[0]), parseInt(atime[1])).getTime()) {
          return this.sorttype=='asc'? 1 : -1;
        }
        return 0;
      });
    }
    if(this.sorttype=='asc'){
      this.sorttype='desc';
    }else{
      this.sorttype='asc';
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
          arrayResult.sort(function (a, b) {
            let adateinfo = a.datetime.split(" ");
            let adate = adateinfo[0].split("-");
            let atime = adateinfo[1].split(":");
            let bdateinfo = b.datetime.split(" ");
            let bdate = bdateinfo[0].split("-");
            let btime = bdateinfo[1].split(":");
            if (new Date(bdate[0], parseInt(bdate[1]) - 1, bdate[2], btime[0], btime[1]).getTime() > new Date(adate[0], parseInt(adate[1]) - 1, adate[2], atime[0], atime[1]).getTime()) {
              return 1;
            } else if (new Date(bdate[0], parseInt(bdate[1]) - 1, bdate[2], btime[0], btime[1]).getTime() < new Date(adate[0], parseInt(adate[1]) - 1, adate[2], atime[0], atime[1]).getTime()) {
              return -1;
            }
            return 0;
          });
          this.items = arrayResult;
          this.loading = false;
        }
      }

    }, (e) => { console.log("ERROR: ", e.status); });
  }
}

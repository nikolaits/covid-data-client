import { Component, OnInit } from '@angular/core';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import { GlobalService } from '../global.service';
import { getDateFormatted, saveToPDF, CountryData, compare, reduceCompare, countryHeadercells } from '../helper';


@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.css']
})
export class CountryComponent implements OnInit {

  public items: Array<CountryData> = [];
  public countries: Array<CountryData> = [];
  public slectedCountry: string = "";
  public sorttype: string = "desc";
  public selectedS: string = "datetime"
  public loading = false;
  public headercells: Array<any> = countryHeadercells;
  constructor(private globalService: GlobalService) { }

  ngOnInit(): void {
    this.dropDownSelectAction('savedSetup');
    let d = new Date();
    d.setHours(d.getHours() - 1);
    d.setMinutes(0);
    let d2 = new Date();
    d2.setHours(23);
    d2.setMinutes(59);
    let sdate = getDateFormatted(d);
    let edate = getDateFormatted(d2);
    this.globalService.getCountriesData({ startdate: sdate, enddate: edate }).subscribe((data: any) => {
      if (data.status === 200) {
        if (data.body) {
          let arrayResult = data.body;
          arrayResult.sort(compare("asc", "country"));
          const result = arrayResult.reduce(reduceCompare("country"), []);
          this.countries = result.filter((obj: CountryData) => {
            return obj.country !== 'World';
          });
          this.getLocation();

        }
      }

    }, e => { console.log("ERROR: ", e.status); });
  }
  public savePDF() {
    const filename = this.slectedCountry + "_data" + new Date().getTime() + ".pdf";
    saveToPDF("#contryTableElementId", this.slectedCountry, filename, 'landscape', 'a3');
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
    this.globalService.getCountryDataForce({ startdate: sdate, enddate: edate, country: this.slectedCountry }).subscribe((data: any) => {
      if (data.status === 200) {
        this.items = [];
        if (data.body) {
          let arrayResult = data.body;
          arrayResult.sort(compare(this.sorttype, this.selectedS));
          this.items = arrayResult;
          this.loading = false;
        }
      }

    }, e => { console.log("ERROR: ", e.status); });
  }
  public sortBy(args) {
    this.selectedS = args;
    this.sorttype == 'asc' ? this.sorttype = 'desc' : this.sorttype = 'asc';
    if (args != 'datetime') {
      this.items.sort(compare(this.sorttype, this.selectedS))

    } else {
      this.items.sort(compare(this.sorttype, this.selectedS));
    }
  }
  public selectChange(args: string) {
    this.loading = true;
    this.slectedCountry = args;
    let d = new Date();
    d.setHours(0);
    d.setMinutes(0);
    let d2 = new Date();
    d2.setHours(23);
    d2.setMinutes(59);
    let sdate = getDateFormatted(d);
    let edate = getDateFormatted(d2);
    this.globalService.getCountryData({ startdate: sdate, enddate: edate, country: this.slectedCountry }).subscribe((data: any) => {
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

  public getLocation() {
    this.globalService.getLocation()
      .then(r => {
        this.globalService.getCountryName(r.latitude, r.longitude)
          .subscribe((data: any) => {
            const elem = this.countries.filter(item => item.country === data.body.address.country);
            if (elem.length > 0) this.selectChange(data.body.address.country);
          }, err => {
            console.log("ERROR: ", err.status);
          })
      })
      .catch(e => {
        console.log("ERROR", e)
      })
  }

  public dropDownSelectAction(args: string) {
    if (args == 'select') {
      this.headercells.forEach(item => {
        item.visibility = true;
      })
    } else if (args == 'deselect') {
      this.headercells.forEach(item => {
        item.visibility = false;
      })
    } else if (args == "savedSetup") {
      let headerItems = localStorage.getItem('countriesHeaderCells');
      headerItems ? this.headercells = JSON.parse(headerItems) : this.dropDownSelectAction('init');
    }
  }

  public saveSetup(args: string, dropdown: NgbDropdown) {
    localStorage.setItem(args, JSON.stringify(this.headercells));
    dropdown.close();
  }
}

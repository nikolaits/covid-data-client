import { Component, OnInit, PipeTransform } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { GlobalService } from '../global.service';
import { getDateFormatted, saveToPDF, CountryData, compare, reduceCompare, countryHeadercells, globalHeadercells } from '../helper';
import { NotificationsService } from '../notifications.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css'],
  providers: [DecimalPipe]
})
export class HistoryComponent implements OnInit {
  public items: Array<any> = []
  public countries: Array<CountryData> = [];
  public displayData$: Observable<any[]>;
  public sorttype: string = "asc";
  public selectedS: string = "datetime";
  public filter = new FormControl('');
  public filterGlobal = new FormControl('');
  public form: FormGroup;
  public loading = false;
  public loadingGlobal = false;
  public selectedCountry = "";
  public searchType = "";
  public startDate = new Date(2020, 4, 20, 0, 0);
  public endDate;
  public countryTableShow = false;
  public globalTableShow = false;
  public headercells: Array<any> = countryHeadercells;
  public globalheadercells: Array<any> = globalHeadercells;
  constructor(private globalService: GlobalService, private pipe: DecimalPipe, private formbuilder: FormBuilder, private nService: NotificationsService) {

  }

  ngOnInit(): void {
    this.dropDownSelectAction('savedSetup');
    this.globalDropDownSelectAction('savedSetup');
    this.form = this.formbuilder.group({
      dateRange: new FormControl([new Date(2020, 3, 17, 0, 0), new Date()]),
    });
    let endd = new Date();
    endd.setHours(23);
    endd.setMinutes(59);
    this.endDate = endd;
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
        }
      }

    }, e => { console.log("ERROR: ", e.status); });

  }
  public savePDF(type: string) {
    switch (type) {
      case "global":
        let gfilename = "global_data" + new Date().getTime() + ".pdf";
        saveToPDF("#myTableElementId", "Global Data", gfilename, 'p', 'a4');
        break;
      case "country":
        const ctfilename = this.selectedCountry + "_data" + new Date().getTime() + ".pdf";
        saveToPDF("#contriesTableElementId", this.selectedCountry, ctfilename, 'landscape', 'a3');
        break;
      case "countries":
        const cfilename = "all_countries_data" + "_data" + new Date().getTime() + ".pdf";
        saveToPDF("#contriesTableElementId", "All countries data", cfilename, 'landscape', 'a3');
        break;

      default:
        break;
    }
  }

  public sortBy(args) {
    this.selectedS = args;
    this.filter.setValue("");
    this.sorttype == 'asc' ? this.sorttype = 'desc' : this.sorttype = 'asc';
    if (args != 'datetime') {
      let sorted$: Observable<any[]> = this.displayData$.pipe(map(items => items.sort(compare(this.sorttype, this.selectedS))))
      this.displayData$ = sorted$;

    } else {
      let sorted$: Observable<any[]> = this.displayData$.pipe(map(items => items.sort(compare(this.sorttype, this.selectedS))));
      this.displayData$ = sorted$;
    }

  }
  public search(text: string, pipe: PipeTransform): CountryData[] {
    return this.items.filter(country => {
      const term = text.toLowerCase();
      return country.country.toLowerCase().includes(term)
        || country.datetime.includes(term)
        || pipe.transform(country.cases).includes(term)
        || pipe.transform(country.todayCases == null ? 0 : country.todayCases.toString()).includes(term)
        || pipe.transform(country.deaths == null ? 0 : country.deaths.toString()).includes(term)
        || pipe.transform(country.todayDeaths == null ? 0 : country.todayDeaths.toString()).includes(term)
        || pipe.transform(country.recovered == null ? 0 : country.recovered.toString()).includes(term)
        || pipe.transform(country.critical == null ? 0 : country.critical.toString()).includes(term)
        || pipe.transform(country.casesPerOneMillion == null ? 0 : country.casesPerOneMillion.toString()).includes(term)
        || pipe.transform(country.deathsPerOneMillion == null ? 0 : country.deathsPerOneMillion.toString()).includes(term)
        || pipe.transform(country.totalTests == null ? 0 : country.totalTests.toString()).includes(term)
        || pipe.transform(country.testsPerOneMillion == null ? 0 : country.testsPerOneMillion.toString()).includes(term);
    });
  }
  public searchGlobal(text: string, pipe: PipeTransform): CountryData[] {
    return this.items.filter(obj => {
      const term = text.toLowerCase();
      return obj.datetime.includes(term)
        || pipe.transform(obj.cases).includes(term)
        || pipe.transform(obj.deaths).includes(term)
        || pipe.transform(obj.recovered).includes(term)
    });
  }
  selectSearch(args: string) {
    this.searchType = args;
    this.items = [];
    this.sorttype = "asc";
    this.selectedS = "datetime";
    this.filter.setValue("");
    this.filterGlobal.setValue("")
    this.loading = false;
    this.loadingGlobal = false;
    this.selectedCountry = "";
    if (this.searchType != "global") {
      this.countryTableShow = true;
      this.globalTableShow = false;
    } else {
      this.globalTableShow = true;
      this.countryTableShow = false;
    }
  }
  public selectChange(args: string) {
    this.selectedCountry = args
  }
  public onSearch() {
    let isValid = true;
    if ((this.searchType == 'country') && (this.selectedCountry == "")) {
      this.nService.pushAlert({ type: 'warning', message: "Please, select country" });
      isValid = false;
    }
    let fvalues = this.form.controls["dateRange"].value;
    if ((fvalues[0] == null) || (fvalues[0] == null)) {
      this.nService.pushAlert({ type: 'warning', message: "Please, select valid DateTime range" });
      isValid = false;
    }
    if (isValid) {
      let sDate = new Date(fvalues[0]);
      let eDate = new Date(fvalues[1]);
      let fsDate = getDateFormatted(sDate);
      let feDate = getDateFormatted(eDate);
      let filter = { startdate: fsDate, enddate: feDate };
      if ((this.searchType == 'country') && (this.selectedCountry != "")) {
        filter['country'] = this.selectedCountry;
      }
      if (this.searchType != "global") {
        this.getCountriesDate(filter);
      } else {
        this.getGlobalData(filter);
      }

    }
    this.items = [];
    this.sorttype = "dec";
    this.selectedS = "datetime";
    this.filter.setValue("");
    this.filterGlobal.setValue("")
    this.loading = false;
    this.loadingGlobal = false;
  }
  public getCountriesDate(flt: any): void {
    this.loading = true;

    this.globalService.getCountriesData(flt).subscribe((data: any) => {
      if (data.status === 200) {
        if (data.body) {
          let arrayResult = data.body;
          arrayResult.sort(compare(this.sorttype, this.selectedS));
          this.items = arrayResult.filter((obj: CountryData) => {
            return obj.country !== 'World';
          });

          this.displayData$ = this.filter.valueChanges.pipe(
            startWith(''),
            map(text => this.search(text, this.pipe))
          );
          this.loading = false;
        }
      }

    }, e => { console.log("ERROR: ", e.status); });
  }

  public getGlobalData(flt: any): void {
    this.loadingGlobal = true;
    this.globalService.getGlobalData(flt).subscribe((data: any) => {
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
          this.displayData$ = this.filterGlobal.valueChanges.pipe(
            startWith(''),
            map(text => this.searchGlobal(text, this.pipe))
          );
          this.loadingGlobal = false;
        }
      }

    }, e => { console.log("ERROR: ", e.status); });
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
      headerItems ? this.headercells = JSON.parse(headerItems) : this.dropDownSelectAction('select');
    }
  }
  public globalDropDownSelectAction(args: string) {
    if (args == 'select') {
      this.globalheadercells.forEach(item => {
        item.visibility = true;
      })
    } else if (args == 'deselect') {
      this.globalheadercells.forEach(item => {
        item.visibility = false;
      })
    } else if (args == "savedSetup") {
      let headerItems = localStorage.getItem('globalHeaderCells');
      headerItems ? this.globalheadercells = JSON.parse(headerItems) : this.globalDropDownSelectAction('select');
    }
  }
  public saveSetup(args: string, dropdown: NgbDropdown) {
    args == 'countriesHeaderCells' ? localStorage.setItem(args, JSON.stringify(this.headercells)) : localStorage.setItem(args, JSON.stringify(this.globalheadercells));
    dropdown.close();
  }
}

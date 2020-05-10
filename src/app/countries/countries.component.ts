import { Component, OnInit, PipeTransform } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormControl } from '@angular/forms';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { GlobalService } from '../global.service';
import { getDateFormatted, saveToPDF, CountryData, compare, countryHeadercells } from '../helper';

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.css'],
  providers: [DecimalPipe]
})
export class CountriesComponent implements OnInit {

  public items: Array<CountryData> = [];
  public countries$: Observable<CountryData[]>;
  public sorttype: string = "asc";
  public selectedS: string = "country";
  public filter = new FormControl('');
  public loading = false;
  public headercells: Array<any> = countryHeadercells;
  constructor(private globalService: GlobalService, private pipe: DecimalPipe) {

  }

  ngOnInit(): void {
    this.dropDownSelectAction('savedSetup');
    this.loading = true;
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
          arrayResult.sort(compare(this.sorttype, this.selectedS));
          let result = arrayResult.filter((obj: CountryData) => {
            return obj.datetime.includes(arrayResult[0].datetime.slice(0, -3))
          })
          this.items = result.filter((obj: CountryData) => {
            return obj.country !== 'World';
          });

          this.countries$ = this.filter.valueChanges.pipe(
            startWith(''),
            map(text => this.search(text, this.pipe))
          );
          this.loading = false;
        }
      }

    }, e => { console.log("ERROR: ", e.status); });
  }
  public savePDF() {
    const filename = "all_countries_data" + "_data" + new Date().getTime() + ".pdf";
    saveToPDF("#contriesTableElementId", "All countries data", filename, 'landscape', 'a3');
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
    this.globalService.getCountriesDataForce({ startdate: sdate, enddate: edate }).subscribe((data: any) => {
      if (data.status === 200) {
        this.items = [];
        if (data.body) {
          this.items = data.body.filter((obj: CountryData) => {
            return obj.country !== 'World';
          });
          this.countries$ = of(this.items);
          this.loading = false;
        }
      }

    }, e => { console.log("ERROR: ", e.status); });
  }
  public sortBy(args) {
    this.selectedS = args;
    this.filter.setValue("");
    this.sorttype == 'asc' ? this.sorttype = 'desc' : this.sorttype = 'asc';
    if (args != 'datetime') {
      this.items.sort(compare(this.sorttype, this.selectedS))
      let sorted$: Observable<CountryData[]> = this.countries$.pipe(map(items => items.sort(compare(this.sorttype, this.selectedS))))
      this.countries$ = sorted$;

    } else {
      let sorted$: Observable<CountryData[]> = this.countries$.pipe(map(items => items.sort(compare(this.sorttype, this.selectedS))));
      this.countries$ = sorted$;
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

  public saveSetup(args: string, dropdown: NgbDropdown) {
    localStorage.setItem(args, JSON.stringify(this.headercells));
    dropdown.close();
  }
}

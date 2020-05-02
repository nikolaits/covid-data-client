import { Component, OnInit, PipeTransform } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormControl } from '@angular/forms';
import { GlobalService } from '../global.service';
import { getDateFormatted, saveToPDF, CountryData } from '../helper';
import { Observable, of, interval } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.css'],
  providers: [DecimalPipe]
})
export class CountriesComponent implements OnInit {

  public items: Array<CountryData> = []
  public countries$: Observable<CountryData[]>
  public sorttype: string = "asc";
  public selectedS: string = "datetime";
  public filter = new FormControl('');
  public loading=false;
  constructor(private globalService: GlobalService, private pipe: DecimalPipe) {
    
  }

  ngOnInit(): void {
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
          // console.log("date", new Date(date[0], parseInt(date[1])-1, date[2], time[0], time[1]))
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

    }, (e) => { console.log("ERROR: ", e.status); });
  }
  public savePDF() {
    const filename = "all_countries_data" + "_data" + new Date().getTime() + ".pdf"
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
          let arrayResult = data.body;
          console.log("arr", arrayResult)
          // console.log("date", new Date(date[0], parseInt(date[1])-1, date[2], time[0], time[1]))
          this.items = data.body.filter((obj: CountryData) => {
            return obj.country !== 'World';
          });
          this.countries$ = of(this.items);
          console.log("data.body", arrayResult[0]);
          this.loading = false;
        }
      }

    }, (e) => { console.log("ERROR: ", e.status); });
  }
  public sortBy(args) {
    this.selectedS = args;
    this.filter.setValue("");
    if (args != 'datetime') {
      this.items.sort((a, b) => {
        if (a[args] < b[args]) {
          return this.sorttype == 'asc' ? -1 : 1;
        }
        if (a[args] > b[args]) {
          return this.sorttype == 'asc' ? 1 : -1;
        }
        return 0;
      })
      let sorted$: Observable<CountryData[]> = this.countries$.pipe(map(items => items.sort((a, b) => {
        if (a[args] < b[args]) {
          return this.sorttype == 'asc' ? -1 : 1;
        }
        if (a[args] > b[args]) {
          return this.sorttype == 'asc' ? 1 : -1;
        }
        return 0;
      })))
      this.countries$ = sorted$;

    } else {
      let sorted$: Observable<CountryData[]> = this.countries$.pipe(map(items => items.sort((a, b) => {
        let adateinfo = a.datetime.split(" ");
        let adate = adateinfo[0].split("-");
        let atime = adateinfo[1].split(":");
        let bdateinfo = b.datetime.split(" ");
        let bdate = bdateinfo[0].split("-");
        let btime = bdateinfo[1].split(":");
        if (new Date(parseInt(bdate[0]), parseInt(bdate[1]) - 1, parseInt(bdate[2]), parseInt(btime[0]), parseInt(btime[1])).getTime() > new Date(parseInt(adate[0]), parseInt(adate[1]) - 1, parseInt(adate[2]), parseInt(atime[0]), parseInt(atime[1])).getTime()) {
          return this.sorttype == 'asc' ? -1 : 1;
        } else if (new Date(parseInt(bdate[0]), parseInt(bdate[1]) - 1, parseInt(bdate[2]), parseInt(btime[0]), parseInt(btime[1])).getTime() < new Date(parseInt(adate[0]), parseInt(adate[1]) - 1, parseInt(adate[2]), parseInt(atime[0]), parseInt(atime[1])).getTime()) {
          return this.sorttype == 'asc' ? 1 : -1;
        }
        return 0;
      })));
      this.countries$ = sorted$;
    }
    if (this.sorttype == 'asc') {
      this.sorttype = 'desc';
    } else {
      this.sorttype = 'asc';
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
}

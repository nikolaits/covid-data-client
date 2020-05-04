import { Component, OnInit, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { Chart } from 'chart.js';
import { saveImgToPDF, GlobalData, getDateFormatted, CountryData } from "../helper"
import { GlobalService } from '../global.service';
import { NotificationsService } from '../notifications.service';
import { NgChartjsService } from 'ng-chartjs';
import { NgbDateStruct, NgbDate, NgbCalendar, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  private isFirstLoad = true;
  public loading = false;
  public items: Array<GlobalData> = [];
  public displayStartDate = "";
  public displayEndDate = "";
  public displayTodayDate = "";
  public selectedCountry = "";
  public countries: Array<CountryData> = [];
  public form: FormGroup;
  public model: NgbDateStruct = {
    year: new Date().getFullYear(),
    month: ((new Date().getMonth()) + 1),
    day: new Date().getDate()
  };
  public hoveredDate: NgbDate | null = null;

  public fromDate: NgbDate;
  public toDate: NgbDate | null = null;
  constructor(@Inject(DOCUMENT) private document: Document, private globalService: GlobalService, private nService: NotificationsService, private formbuilder: FormBuilder, private ngChartjsService: NgChartjsService, private calendar: NgbCalendar, public formatter: NgbDateParserFormatter) {
    this.form = this.formbuilder.group({
      dateRange: new FormControl([new Date(2020, 3, 17, 0, 0), new Date()]),
    });
    this.fromDate = calendar.getToday();
    this.toDate = calendar.getNext(calendar.getToday(), 'd', 10);


  }

  lineChartData: Chart.ChartDataSets[] = [
    {
      label: 'Cases',
      fill: false,
      lineTension: 0.1,
      backgroundColor: 'rgba(75,192,192,0.4)',
      borderColor: 'rgba(75,192,192,1)',
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: 'rgba(75,192,192,1)',
      pointBackgroundColor: '#fff',
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: 'rgba(75,192,192,1)',
      pointHoverBorderColor: 'rgba(220,220,220,1)',
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      data: [0],
    },
    {
      label: 'Deaths',
      fill: false,
      lineTension: 0.1,
      backgroundColor: 'rgba(75,192,192,0.4)',
      borderColor: 'rgba(75,192,192,1)',
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: 'rgba(75,192,192,1)',
      pointBackgroundColor: '#fff',
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: 'rgba(75,192,192,1)',
      pointHoverBorderColor: 'rgba(220,220,220,1)',
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      data: [0],
    },
    {
      label: 'Recovered',
      fill: false,
      lineTension: 0.1,
      backgroundColor: 'rgba(75,192,192,0.4)',
      borderColor: 'rgba(75,192,192,1)',
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: 'rgba(75,192,192,1)',
      pointBackgroundColor: '#fff',
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: 'rgba(75,192,192,1)',
      pointHoverBorderColor: 'rgba(220,220,220,1)',
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      data: [0],
    }
  ];
  lineChartLabels: Array<any> = ['0'];
  lineChartOptions: any = {
    responsive: true
  };
  lineChartLegend = true;
  lineChartType = 'line';
  inlinePlugin: any;
  globalDataChart: any;
  countrylineChartData: Chart.ChartDataSets[] = [
    {
      label: 'Cases',
      fill: false,
      lineTension: 0.1,
      backgroundColor: 'rgba(75,192,192,0.4)',
      borderColor: 'rgba(75,192,192,1)',
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: 'rgba(75,192,192,1)',
      pointBackgroundColor: '#fff',
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: 'rgba(75,192,192,1)',
      pointHoverBorderColor: 'rgba(220,220,220,1)',
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      data: [0],
    },
    {
      label: 'Deaths',
      fill: false,
      lineTension: 0.1,
      backgroundColor: 'rgba(75,192,192,0.4)',
      borderColor: 'rgba(75,192,192,1)',
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: 'rgba(75,192,192,1)',
      pointBackgroundColor: '#fff',
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: 'rgba(75,192,192,1)',
      pointHoverBorderColor: 'rgba(220,220,220,1)',
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      data: [0],
    },
    {
      label: 'Recovered',
      fill: false,
      lineTension: 0.1,
      backgroundColor: 'rgba(75,192,192,0.4)',
      borderColor: 'rgba(75,192,192,1)',
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: 'rgba(75,192,192,1)',
      pointBackgroundColor: '#fff',
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: 'rgba(75,192,192,1)',
      pointHoverBorderColor: 'rgba(220,220,220,1)',
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      data: [0],
    }
  ];
  countrylineChartLabels: Array<any> = ['0'];
  countrylineChartOptions: any = {
    responsive: true
  };
  countrylineChartLegend = true;
  countrylineChartType = 'line';
  countryinlinePlugin: any;
  countryglobalDataChart: any;
  barChartData: Chart.ChartDataSets[] = [
    {
      label: 'Cases',
      fill: false,
      lineTension: 0.1,
      backgroundColor: 'rgba(75,192,192,0.4)',
      borderColor: 'rgba(75,192,192,1)',
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: 'rgba(75,192,192,1)',
      pointBackgroundColor: '#fff',
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: 'rgba(75,192,192,1)',
      pointHoverBorderColor: 'rgba(220,220,220,1)',
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      data: [0],
    },
    {
      label: 'Deaths',
      fill: false,
      lineTension: 0.1,
      backgroundColor: 'rgba(75,192,192,0.4)',
      borderColor: 'rgba(75,192,192,1)',
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: 'rgba(75,192,192,1)',
      pointBackgroundColor: '#fff',
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: 'rgba(75,192,192,1)',
      pointHoverBorderColor: 'rgba(220,220,220,1)',
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      data: [0],
    },
    {
      label: 'Recovered',
      fill: false,
      lineTension: 0.1,
      backgroundColor: 'rgba(75,192,192,0.4)',
      borderColor: 'rgba(75,192,192,1)',
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: 'rgba(75,192,192,1)',
      pointBackgroundColor: '#fff',
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: 'rgba(75,192,192,1)',
      pointHoverBorderColor: 'rgba(220,220,220,1)',
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      data: [0],
    }
  ];
  barChartLabels: Array<any> = ['0'];
  barChartOptions: any = {
    responsive: true
  };
  barChartLegend = true;
  barChartType = 'bar';
  barInlinePlugin: any;
  barglobalDataChart: any;


  todayPieChartOptions: Chart.ChartOptions = {
    responsive: true
  };
  todayPieChartLabels: any = ['Casses(%)', 'Deaths(%)', 'Recovered(%)'];
  todayPieChartData = [
    {
      fill: false,
      backgroundColor: 'rgba(75,192,192,0.4)',
      pointBorderColor: 'rgba(75,192,192,1)',
      pointBackgroundColor: '#fff',
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: 'rgba(75,192,192,1)',
      pointHoverBorderColor: 'rgba(220,220,220,1)',
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      data: [100, 0, 0],
    }
  ]
  todayPieChartType = 'pie';
  todayPieChartLegend = true;
  todayPieChartPlugin: any;
  todayPieGlobalDataChart: any;
  todayPieChartColors = [
    {
      backgroundColor: ['rgba(255,0,0,0.3)', 'rgba(0,255,0,0.3)', 'rgba(0,0,255,0.3)'],
    },
  ];

  pieChartOptions: Chart.ChartOptions = {
    responsive: true
  };
  pieChartLabels: any = ['Casses(%)', 'Deaths(%)', 'Recovered(%)'];
  pieChartData = [
    {
      label: '',
      fill: false,
      backgroundColor: 'rgba(75,192,192,0.4)',
      pointBorderColor: 'rgba(75,192,192,1)',
      pointBackgroundColor: '#fff',
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: 'rgba(75,192,192,1)',
      pointHoverBorderColor: 'rgba(220,220,220,1)',
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      data: [50, 40, 10],
    }
  ]
  pieChartType = 'pie';
  pieChartLegend = true;
  pieChartPlugin: any;
  pieGlobalDataChart: any;
  pieChartColors = [
    {
      backgroundColor: ['rgba(255,0,0,0.3)', 'rgba(0,255,0,0.3)', 'rgba(0,0,255,0.3)'],
    },
  ];

  ngOnInit() {
    this.onSearch();
    this.getTodayData();
    this.getCountriesData();
    this.globalDataChart = [{
      id: 'globalChartData',
      beforeDraw(chart: any): any {
        const width = chart.chart.width;
        const height = chart.chart.height;
        const ctx = chart.chart.ctx;
        ctx.restore();
        const fontSize = (height / 114).toFixed(2);
        ctx.font = `${fontSize}em sans-serif`;
        ctx.textBaseline = 'middle';
        const text = '';//'Covid 19 - Global Data';
        const textX = Math.round((width - ctx.measureText(text).width) / 2);
        const textY = height / 2;
        ctx.fillText(text, textX, textY);
        ctx.save();
      }
    }];
    this.countryglobalDataChart = [{
      id: 'countryGlobalChartData',
      beforeDraw(chart: any): any {
        const width = chart.chart.width;
        const height = chart.chart.height;
        const ctx = chart.chart.ctx;
        ctx.restore();
        const fontSize = (height / 114).toFixed(2);
        ctx.font = `${fontSize}em sans-serif`;
        ctx.textBaseline = 'middle';
        const text = '';//'Covid 19 - Global Data';
        const textX = Math.round((width - ctx.measureText(text).width) / 2);
        const textY = height / 2;
        ctx.fillText(text, textX, textY);
        ctx.save();
      }
    }];
    this.barglobalDataChart = [{
      id: 'globalChartData2',
      beforeDraw(chart: any): any {
        const width = chart.chart.width;
        const height = chart.chart.height;
        const ctx = chart.chart.ctx;
        ctx.restore();
        const fontSize = (height / 114).toFixed(2);
        ctx.font = `${fontSize}em sans-serif`;
        ctx.textBaseline = 'middle';
        const text = '';
        const textX = Math.round((width - ctx.measureText(text).width) / 2);
        const textY = height / 2;
        ctx.fillText(text, textX, textY);
        ctx.save();
      }
    }];
    this.todayPieGlobalDataChart = [{
      id: 'todayglobalChartData',
      beforeDraw(chart: any): any {
        const width = chart.chart.width;
        const height = chart.chart.height;
        const ctx = chart.chart.ctx;
        ctx.restore();
        const fontSize = (height / 114).toFixed(2);
        ctx.font = `${fontSize}em sans-serif`;
        ctx.textBaseline = 'middle';
        const text = '';
        const textX = Math.round((width - ctx.measureText(text).width) / 2);
        const textY = height / 2;
        ctx.fillText(text, textX, textY);
        ctx.save();
      }
    }];
    this.pieGlobalDataChart = [{
      id: 'globalChartDatadate',
      beforeDraw(chart: any): any {
        const width = chart.chart.width;
        const height = chart.chart.height;
        const ctx = chart.chart.ctx;
        ctx.restore();
        const fontSize = (height / 114).toFixed(2);
        ctx.font = `${fontSize}em sans-serif`;
        ctx.textBaseline = 'middle';
        const text = '';
        const textX = Math.round((width - ctx.measureText(text).width) / 2);
        const textY = height / 2;
        ctx.fillText(text, textX, textY);
        ctx.save();
      }
    }];
    this.inlinePlugin = this.globalDataChart;
    this.countryinlinePlugin = this.countryglobalDataChart;
    this.barInlinePlugin = this.barglobalDataChart;
    this.todayPieChartPlugin = this.todayPieGlobalDataChart;
    this.pieChartPlugin = this.pieGlobalDataChart;

  }
  public savePDF(chrtId: string) {
    let canvas: any = this.document.getElementById(chrtId);
    let imgData = canvas.toDataURL('image/png');
    saveImgToPDF(imgData, chrtId.toUpperCase(), chrtId, 'landscape', 'a3')
  }
  public saveCountryPDF(chrtId: string) {
    let canvas: any = this.document.getElementById(chrtId);
    let imgData = canvas.toDataURL('image/png');
    saveImgToPDF(imgData, this.selectedCountry, chrtId, 'landscape', 'a3')
  }
  public onSearch() {
    let isValid = true;
    let fvalues = this.form.controls["dateRange"].value;
    if ((fvalues[0] == null) || (fvalues[0] == null)) {
      this.nService.pushAlert({ type: 'warning', message: "Please, select valid DateTime range" });
      isValid = false;
    }
    if (isValid) {
      this.items = [];
      let sDate = new Date(fvalues[0]);
      let eDate = new Date(fvalues[1]);
      let fsDate = getDateFormatted(sDate);
      let feDate = getDateFormatted(eDate);
      this.displayStartDate = fsDate;
      this.displayEndDate = feDate;
      let filter = { startdate: fsDate, enddate: feDate };
      this.getGlobalData(filter);
    }

  }
  public getGlobalData(filter: any) {
    this.globalService.getGlobalData(filter).subscribe((data: any) => {
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
              return -1;
            } else if (new Date(bdate[0], parseInt(bdate[1]) - 1, bdate[2], btime[0], btime[1]).getTime() < new Date(adate[0], parseInt(adate[1]) - 1, adate[2], atime[0], atime[1]).getTime()) {
              return 1;
            }
            return 0;
          });
          this.items = arrayResult;
          while (this.lineChartData[0].data.length > 0) {
            this.lineChartLabels.pop()
            this.lineChartData[0].data.pop();
            this.lineChartData[1].data.pop();
            this.lineChartData[2].data.pop();
            this.barChartLabels.pop();
            this.barChartData[0].data.pop();
            this.barChartData[1].data.pop();
            this.barChartData[2].data.pop();
          }
          this.lineChartLabels.push('0')
          this.lineChartData[0].data.push(0);
          this.lineChartData[1].data.push(0);
          this.lineChartData[2].data.push(0);
          this.items.forEach(item => {
            this.lineChartLabels.push(item.datetime)
            this.lineChartData[0].data.push(item.cases);
            this.lineChartData[1].data.push(item.deaths);
            this.lineChartData[2].data.push(item.recovered);
            this.barChartLabels.push(item.datetime)
            this.barChartData[0].data.push(item.cases);
            this.barChartData[1].data.push(item.deaths);
            this.barChartData[2].data.push(item.recovered);
          })
          const chart: any = this.ngChartjsService.getChart('firstChart');
          chart.update();
          const chart2: any = this.ngChartjsService.getChart('secondChart');
          chart2.update()

        }
      }

    }, (e) => { console.log("ERROR: ", e.status); });
  }
  public getGlobalDataForDate(filter: any, type: string) {
    this.globalService.getGlobalData(filter).subscribe((data: any) => {
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
          if (arrayResult[0] && arrayResult[0].cases) {
            let activeCases = (arrayResult[0].cases - (arrayResult[0].deaths + arrayResult[0].recovered));
            let deaths = arrayResult[0].deaths;
            let recovered = arrayResult[0].recovered;
            let all = activeCases + deaths + recovered;
            let fvalue = Math.round((activeCases / all) * 100)
            let svalue = Math.round((deaths / all) * 100);
            let tvalue = Math.round((recovered / all) * 100);

            if (type == "today") {
              this.todayPieChartData[0].data[0] = fvalue;
              this.todayPieChartData[0].data[1] = svalue;
              this.todayPieChartData[0].data[2] = tvalue;
            } else {
              this.pieChartData[0].data[0] = fvalue;
              this.pieChartData[0].data[1] = svalue;
              this.pieChartData[0].data[2] = tvalue;
            }
          } else {
            if (type == "today") {
              this.todayPieChartData[0].data[0] = 0;
              this.todayPieChartData[0].data[1] = 0;
              this.todayPieChartData[0].data[2] = 0;
            } else {
              this.pieChartData[0].data[0] = 0;
              this.pieChartData[0].data[1] = 0;
              this.pieChartData[0].data[2] = 0;
            }
          }

          if (type == "today") {
            const pchart: any = this.ngChartjsService.getChart('thirdChart');
            pchart.update();
          } else {

            const pchart2: any = this.ngChartjsService.getChart('fourthChart');
            pchart2.update()
          }
        }
      }

    }, (e) => { console.log("ERROR: ", e.status); });
  }
  public getTodayData() {
    let sDate = new Date();
    sDate.setHours(0);
    sDate.setMinutes(0);
    let eDate = new Date();
    eDate.setHours(23);
    eDate.setMinutes(59);
    let fsDate = getDateFormatted(sDate);
    let feDate = getDateFormatted(eDate);
    let doday = getDateFormatted(new Date());
    this.displayTodayDate = doday.slice(0, -5);
    let filter = { startdate: fsDate, enddate: feDate };
    this.getGlobalDataForDate(filter, 'today')
    this.getGlobalDataForDate(filter, '')
  }
  public onDateSelection(args: NgbDate) {
    let sDate = new Date(args.year, args.month - 1, args.day);
    sDate.setHours(0);
    sDate.setMinutes(0);
    let eDate = new Date(args.year, args.month - 1, args.day);
    eDate.setHours(23);
    eDate.setMinutes(59);
    let fsDate = getDateFormatted(sDate);
    let feDate = getDateFormatted(eDate);
    let filter = { startdate: fsDate, enddate: feDate };
    this.getGlobalDataForDate(filter, 'selectedDate')
  }
  public selectChange(args: string) {
    this.selectedCountry = args;
    if (this.isFirstLoad) {
      this.isFirstLoad = false;
      let d = new Date(this.fromDate.year, (this.fromDate.month-1), this.fromDate.day);
      d.setHours(0);
      d.setMinutes(0);
      let d2 = new Date(this.toDate.year, (this.toDate.month-1), this.toDate.day);
      d2.setHours(23);
      d2.setMinutes(59);
      let sdate = getDateFormatted(d);
      let edate = getDateFormatted(d2);
      let filter = { startdate: sdate, enddate: edate, country: this.selectedCountry };
      this.getCountryInfo(filter);
    }
  }
  onDateSelectionRange(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date && date.after(this.fromDate)) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
    if (this.fromDate && this.toDate) {
      let d = new Date(this.fromDate.year, (this.fromDate.month-1), this.fromDate.day);
      d.setHours(0);
      d.setMinutes(0);
      let d2 = new Date(this.toDate.year, (this.toDate.month-1), this.toDate.day);
      d2.setHours(23);
      d2.setMinutes(59);
      let sdate = getDateFormatted(d);
      let edate = getDateFormatted(d2);
      let filter = { startdate: sdate, enddate: edate, country: this.selectedCountry };
      this.getCountryInfo(filter);
    }
  }

  isHovered(date: NgbDate) {
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
  }

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return date.equals(this.fromDate) || (this.toDate && date.equals(this.toDate)) || this.isInside(date) || this.isHovered(date);
  }

  validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
    const parsed = this.formatter.parse(input);
    return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
  }
  public getCountryInfo(filter: any) {

    this.globalService.getCountryData(filter).subscribe((data: any) => {
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
          while (this.countrylineChartData[0].data.length > 0) {
            this.countrylineChartLabels.pop()
            this.countrylineChartData[0].data.pop();
            this.countrylineChartData[1].data.pop();
            this.countrylineChartData[2].data.pop();
          }
          this.countrylineChartLabels.push('0')
          this.countrylineChartData[0].data.push(0);
          this.countrylineChartData[1].data.push(0);
          this.countrylineChartData[2].data.push(0);
          arrayResult.forEach(item => {
            this.countrylineChartLabels.push(item.datetime)
            this.countrylineChartData[0].data.push(item.cases);
            this.countrylineChartData[1].data.push(item.deaths);
            this.countrylineChartData[2].data.push(item.recovered);
          })
          const chart5: any = this.ngChartjsService.getChart('fifthChart');
          chart5.update();
        }
      }

    }, (e) => { console.log("ERROR: ", e.status); });
  }
  public getCountriesData() {
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
          const result = arrayResult.reduce((obj, current) => {
            const x = obj.find(item => item.country === current.country);
            if (!x) {
              return obj.concat([current]);
            } else {
              return obj;
            }
          }, []);
          result.sort((a, b) => {
            if (a.country > b.country) {
              return 1;
            } else if (a.country < b.country) {
              return -1;
            }
            return 0;
          })
          this.countries = result.filter((obj: CountryData) => {
            return obj.country !== 'World';
          });
        }
      }

    }, (e) => { console.log("ERROR: ", e.status); });

  }

}

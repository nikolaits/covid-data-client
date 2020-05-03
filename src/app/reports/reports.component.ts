import { Component, OnInit, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { Chart } from 'chart.js';
import { saveImgToPDF, GlobalData, getDateFormatted } from "../helper"
import { GlobalService } from '../global.service';
import { NotificationsService } from '../notifications.service';
import { NgChartjsService } from 'ng-chartjs';
import { NgbDateStruct, NgbDate } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  public loading = false;
  public items: Array<GlobalData> = [];
  public displayStartDate = "";
  public displayEndDate = "";
  public displayTodayDate = "";
  public form: FormGroup;
  public model: NgbDateStruct = {
    year: new Date().getFullYear(),
    month: ((new Date().getMonth()) + 1),
    day: new Date().getDate()
  };
  constructor(@Inject(DOCUMENT) private document: Document, private globalService: GlobalService, private nService: NotificationsService, private formbuilder: FormBuilder, private ngChartjsService: NgChartjsService) {
    this.form = this.formbuilder.group({
      dateRange: new FormControl([new Date(2020, 3, 17, 0, 0), new Date()]),
    });
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
    this.barInlinePlugin = this.barglobalDataChart;
    this.todayPieChartPlugin = this.todayPieGlobalDataChart;
    this.pieChartPlugin = this.pieGlobalDataChart;

  }
  public savePDF(chrtId: string) {
    let canvas: any = this.document.getElementById(chrtId);
    let imgData = canvas.toDataURL('image/png');
    saveImgToPDF(imgData, chrtId.toUpperCase(), chrtId, 'landscape', 'a3')
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
          }else{
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

}

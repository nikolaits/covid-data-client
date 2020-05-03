import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../global.service';
import { getDateFormatted, saveToPDF, GlobalData } from '../helper';


@Component({
  selector: 'app-globaldata',
  templateUrl: './globaldata.component.html',
  styleUrls: ['./globaldata.component.css']
})
export class GlobaldataComponent implements OnInit {
  public items: Array<GlobalData> = []
  public tableDivClass = "info_table";
  public startDataModel=new Date();
  public closeResult = '';
  public loading=false;
  constructor(private globalService: GlobalService) { }
  
  ngOnInit(): void {
    let d = new Date();
    d.setHours(0);
    d.setMinutes(0);
    let d2 = new Date();
    d2.setHours(23);
    d2.setMinutes(59);
    let sdate = getDateFormatted(d);
    let edate = getDateFormatted(d2);
    this.globalService.getGlobalData({ startdate: sdate, enddate: edate }).subscribe((data: any) => {
      if (data.status === 200) {
        if (data.body) {
          let arrayResult = data.body;
          console.log("arr", arrayResult)
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
          this.items = arrayResult;
          console.log("data.body", arrayResult[0]);
        }
      }

    }, (e) => { console.log("ERROR: ", e.status); });
  }
  public savePDF(){ 
    const filename  = "global_data"+new Date().getTime()+".pdf"
    saveToPDF("#myTableElementId", "Global Data", filename,'p', 'a4');
  }
  public getForceData(){
    let d = new Date();
    d.setHours(0);
    d.setMinutes(0);
    let d2 = new Date();
    d2.setHours(23);
    d2.setMinutes(59);
    let sdate = getDateFormatted(d);
    let edate = getDateFormatted(d2);
    this.globalService.getGlobalDataForce({ startdate: sdate, enddate: edate }).subscribe((data: any) => {
      if (data.status === 200) {
        this.items=[];
        if (data.body) {
          let arrayResult = data.body;
          console.log("arr", arrayResult)
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
          this.items = arrayResult;
          console.log("data.body", arrayResult[0]);
        }
      }

    }, (e) => { console.log("ERROR: ", e.status); });
  }
}

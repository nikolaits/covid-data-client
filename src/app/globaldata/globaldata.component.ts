import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../global.service';
import { getDateFormatted, saveToPDF, GlobalData, compare } from '../helper';


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
          arrayResult.sort(compare("desc", "datetime"));
          this.items = arrayResult;
        }
      }

    }, e => { console.log("ERROR: ", e.status); });
  }
  public savePDF(){ 
    const filename  = "global_data"+new Date().getTime()+".pdf";
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
          arrayResult.sort(compare("desc", "datetime"));
          this.items = arrayResult;
        }
      }

    }, e => { console.log("ERROR: ", e.status); });
  }
}

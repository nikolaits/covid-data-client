import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../global.service';
import { getDateFormatted, saveToPDF, GlobalData, compare, globalHeadercells } from '../helper';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';


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
  public globalheadercells:Array<any> = globalHeadercells;

  constructor(private globalService: GlobalService) { }
  
  ngOnInit(): void {
    this.globalDropDownSelectAction('savedSetup');
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
      headerItems ? this.globalheadercells = JSON.parse(headerItems) : this.globalDropDownSelectAction('init');
    }
  }
  public saveSetup(args: string, dropdown: NgbDropdown) {
    localStorage.setItem(args, JSON.stringify(this.globalheadercells));
    dropdown.close();
  }
}

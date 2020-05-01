import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../global.service';
interface GlobalData{
  id:number,
  cases:number,
  deaths:number,
  recovered:number,
  datetime:string
}
@Component({
  selector: 'app-globaldata',
  templateUrl: './globaldata.component.html',
  styleUrls: ['./globaldata.component.css']
})
export class GlobaldataComponent implements OnInit {
  public items:Array<GlobalData>=[]
  public tableDivClass="info_table"
  constructor(private globalService: GlobalService) { }

  ngOnInit(): void {
    this.globalService.getGlobalData({}).subscribe((data: any) => {
      if (data.status === 200) {
        let arrayResult  = data.body;
        // console.log("date", new Date(date[0], parseInt(date[1])-1, date[2], time[0], time[1]))
        arrayResult.sort(function(a,b){
          let adateinfo = a.datetime.split(" ");
          let adate = adateinfo[0].split("-");
          let atime = adateinfo[1].split(":");
          let bdateinfo = b.datetime.split(" ");
          let bdate = bdateinfo[0].split("-");
          let btime = bdateinfo[1].split(":");
          if(new Date(bdate[0], parseInt(bdate[1])-1, bdate[2], btime[0], btime[1]).getTime() > new Date(adate[0], parseInt(adate[1])-1, adate[2], atime[0], atime[1]).getTime()){
            return 1;
          } else if(new Date(bdate[0], parseInt(bdate[1])-1, bdate[2], btime[0], btime[1]).getTime() < new Date(adate[0], parseInt(adate[1])-1, adate[2], atime[0], atime[1]).getTime()){
            return -1;
          }
          return 0;
        });
        this.items.push(arrayResult[0])
        console.log("data.body",arrayResult[0]);
      }

    }, (e) => { console.log("ERROR: ", e.status); });
  }

}

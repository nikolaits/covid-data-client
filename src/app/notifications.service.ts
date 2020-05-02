import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
export interface Alert {
  type: string;
  message: string;
}
@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  private _timeout:number = 3000;
  private _alerts:BehaviorSubject<Alert[]> = new BehaviorSubject<Alert[]>([]);
  public data = this._alerts.asObservable();
  
  constructor() {
  }

  get timeout(){
    return this._timeout;
  }
  set timeout(args: number){
    this._timeout = args;
  }
  pushAlert(alert:any){
    this._alerts.next(this._alerts.getValue().concat(alert));
    setTimeout(()=>{
      this._alerts.next(this._alerts.getValue().slice(1,this._alerts.getValue().length))
    },this._timeout);
  }
}
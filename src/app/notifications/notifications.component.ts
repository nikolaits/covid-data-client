import { Component, OnInit } from '@angular/core';
import {NotificationsService, Alert} from "../notifications.service"

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {
  public alerts:Alert[]=[];
  constructor(private nservice:NotificationsService) { 
    this.nservice.data.subscribe((args)=>{
      this.alerts=args;
    })
  }
  
  ngOnInit(): void {
  }
  close(alert: Alert) {
    this.alerts.splice(this.alerts.indexOf(alert), 1);
  }
}
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { baseURL, getAddrURL } from './helper';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  constructor(private http: HttpClient) { }

  public getGlobalData(data:any) {
    let headers = new HttpHeaders();
    headers = headers.append('filters', JSON.stringify(data));
    return this.http.get(baseURL+"/getGlobalData", { headers: headers, observe: 'response' });
  }
  public getGlobalDataForce(data:any) {
    let headers = new HttpHeaders();
    headers = headers.append('filters', JSON.stringify(data));
    return this.http.get(baseURL+"/getGlobalDataForce", { headers: headers, observe: 'response' });
  }
  public getCountryData(data:any) {
    let headers = new HttpHeaders();
    headers = headers.append('filters', JSON.stringify(data));
    return this.http.get(baseURL+"/getCountriesData", { headers: headers, observe: 'response' });
  }
  public getCountryDataForce(data:any) {
    let headers = new HttpHeaders();
    headers = headers.append('filters', JSON.stringify(data));
    return this.http.get(baseURL+"/getCountriesDataForce", { headers: headers, observe: 'response' });
  }
  public getCountriesData(data:any) {
    let headers = new HttpHeaders();
    headers = headers.append('filters', JSON.stringify(data));
    return this.http.get(baseURL+"/getCountriesData", { headers: headers, observe: 'response' });
  }
  public getCountriesDataForce(data:any) {
    let headers = new HttpHeaders();
    headers = headers.append('filters', JSON.stringify(data));
    return this.http.get(baseURL+"/getCountriesDataForce", { headers: headers, observe: 'response' });
  }
  public getLocation(): Promise<any>{
    return new Promise((resolve, reject)=>{
      if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(position=>{
            const longitude = position.coords.longitude;
            const latitude = position.coords.latitude;
            resolve({latitude:latitude, longitude:longitude})
          }, err=>{
            reject(err);
          });
      } else {
        reject("not_supported")
      }
    })
  }
  public getCountryName(latitude:number, longitude:number) {
    return this.http.get(`${getAddrURL}?lat=${latitude}&lon=${longitude}&format=json`, { observe: 'response' });
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { baseURL } from './helper';

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
}

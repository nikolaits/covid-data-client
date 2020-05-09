import { isDevMode } from '@angular/core';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
// export const baseURL = "http://localhost:3009";
export const baseURL = "https://www.geit-dev.info/api/covid19";
export const getAddrURL = "https://nominatim.openstreetmap.org/reverse";

export interface CountryData {
  id: number,
  country: string,
  cases: number,
  todayCases: number,
  deaths: number,
  todayDeaths: number,
  recovered: number,
  active: number,
  critical: number,
  casesPerOneMillion: number,
  deathsPerOneMillion: number,
  totalTests: number,
  testsPerOneMillion: number,
  datetime: string
}

export interface GlobalData {
  id: number,
  cases: number,
  deaths: number,
  recovered: number,
  datetime: string
}

export const countryHeadercells: Array<any> = [
  { value: 'country', name: 'Country', visibility: true },
  { value: 'cases', name: 'Cases', visibility: true },
  { value: 'todayCases', name: 'TodayCases', visibility: true },
  { value: 'deaths', name: 'Deaths', visibility: true },
  { value: 'todayDeaths', name: 'TodayDeaths', visibility: true },
  { value: 'recovered', name: 'Recovered', visibility: true },
  { value: 'active', name: 'Active', visibility: true },
  { value: 'critical', name: 'Critical', visibility: true },
  { value: 'casesPerOneMillion', name: 'CasesPerOneMillion', visibility: true },
  { value: 'deathsPerOneMillion', name: 'DeathsPerOneMillion', visibility: true },
  { value: 'totalTests', name: 'TotalTests', visibility: true },
  { value: 'testsPerOneMillion', name: 'TestsPerOneMillion', visibility: true },
  { value: 'datetime', name: 'Date', visibility: true },
];

export const globalHeadercells: Array<any> = [
  { value: 'cases', name: 'Cases', visibility: true },
  { value: 'deaths', name: 'Deaths', visibility: true },
  { value: 'recovered', name: 'Recovered', visibility: true },
  { value: 'datetime', name: 'Date', visibility: true },
];

export function getDateFormatted(date: Date) {
  let mString = (date.getMonth() + 1) > 9 ? (date.getMonth() + 1) : ("0" + (date.getMonth() + 1));
  let dString = (date.getDate()) > 9 ? date.getDate() : ("0" + (date.getDate()));
  let hString = (date.getHours()) > 9 ? date.getHours() : ("0" + (date.getHours()));
  let mntString = (date.getMinutes()) > 9 ? date.getMinutes() : ("0" + (date.getMinutes()));
  let result = `${date.getFullYear()}-${mString}-${dString} ${hString}:${mntString}`;

  return result;
}
export function verifyDate(d) {
  var re = /^\d{4}-(0[1-9]|1[0-2])-([0-2]\d|3[01]) (0\d|1[01]):[0-5]\d:[0-5]\d$/;
  //         yyyy -       MM      -       dd           hh     :   mm  :   ss
  return re.test(d);
}
// save to PDF methods
export function saveToPDF(id: string, title: string, filename: string, orientation: string, format: string) {
  let l = {
    orientation: orientation,
    unit: 'mm',
    format: format,
    compress: true,
    fontSize: 8,
    lineHeight: 1,
    autoSize: false,
    printHeaders: true
  };
  let doc = new jsPDF(l, '', '', '');
  doc.fromHTML('<h1>' + title + '</h1>', 15, 10)
  doc.autoTable({ html: id, startY: 35 })

  doc.save(filename);
}
export function saveImgToPDF(imgData: string, title: string, filename: string, orientation: string, format: string) {
  let l = {
    orientation: orientation,
    unit: 'mm',
    format: format,
    compress: true,
    fontSize: 8,
    lineHeight: 1,
    autoSize: false,
    printHeaders: true
  };
  let doc = new jsPDF(l, '', '', '');
  doc.fromHTML('<h1>' + title + '</h1>', 15, 10)
  doc.addImage(imgData, 'PNG', 15, 35);

  doc.save(filename);
}

// sort method

export function compare(type: string, property: string) {
  if (property == "datetime") {
    return (a, b) => {
      let adateinfo = a[property].split(" ");
      let adate = adateinfo[0].split("-");
      let atime = adateinfo[1].split(":");
      let bdateinfo = b[property].split(" ");
      let bdate = bdateinfo[0].split("-");
      let btime = bdateinfo[1].split(":");
      if (new Date(parseInt(bdate[0]), parseInt(bdate[1]) - 1, parseInt(bdate[2]), parseInt(btime[0]), parseInt(btime[1])).getTime() > new Date(parseInt(adate[0]), parseInt(adate[1]) - 1, parseInt(adate[2]), parseInt(atime[0]), parseInt(atime[1])).getTime()) {
        return type == 'asc' ? -1 : 1;
      } else if (new Date(parseInt(bdate[0]), parseInt(bdate[1]) - 1, parseInt(bdate[2]), parseInt(btime[0]), parseInt(btime[1])).getTime() < new Date(parseInt(adate[0]), parseInt(adate[1]) - 1, parseInt(adate[2]), parseInt(atime[0]), parseInt(atime[1])).getTime()) {
        return type == 'asc' ? 1 : -1;
      }
      return 0;
    }
  } else {
    return (a, b) => {
      if (a[property] < b[property]) {
        return type == 'asc' ? -1 : 1;
      }
      if (a[property] > b[property]) {
        return type == 'asc' ? 1 : -1;
      }
      return 0;
    }
  }
}

export function reduceCompare(property: string) {
  return (obj, current) => {
    const x = obj.find(item => item[property] === current[property]);
    if (!x) {
      return obj.concat([current]);
    } else {
      return obj;
    }
  };
}
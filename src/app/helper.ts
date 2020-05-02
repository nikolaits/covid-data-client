import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
export const baseURL = "http://localhost:3009";

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
export function getDateFormatted(date: Date) {
  let mString = (date.getMonth() + 1) > 9 ? (date.getMonth() + 1) : ("0" + (date.getMonth() + 1));
  let dString = (date.getDate()) > 9 ? date.getDate() : ("0" + (date.getDate()));
  let hString = (date.getHours()) > 9 ? date.getHours() : ("0" + (date.getHours()));
  let mntString = (date.getMinutes()) > 9 ? date.getMinutes() : ("0" + (date.getMinutes()));
  let result = date.getFullYear() + "-" + mString + "-" + dString + " " + hString + ":" + mntString;

  return result;
}
export function verifyDate(d) {
  var re = /^\d{4}-(0[1-9]|1[0-2])-([0-2]\d|3[01]) (0\d|1[01]):[0-5]\d:[0-5]\d$/;
  //         yyyy -       MM      -       dd           hh     :   mm  :   ss
  return re.test(d);
}
export function saveToPDF(id:string, title:string, filename:string, orientation:string, format:string) {
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
  doc.fromHTML('<h1>'+title+'</h1>', 15, 10)
  doc.autoTable({ html: id, startY: 35 })

  doc.save(filename);
}
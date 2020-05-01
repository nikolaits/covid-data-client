export const baseURL = "http://localhost:3009";
export function getDateFormatted(date:Date){
    let mString = (date.getMonth() + 1) > 9 ? (date.getMonth() + 1) : ("0" + (date.getMonth() + 1));
    let dString = (date.getDate()) > 9 ? date.getDate() : ("0" + (date.getDate()));
    let hString = (date.getHours()) > 9 ? date.getHours() : ("0" + (date.getHours()));
    let mntString = (date.getMinutes()) > 9 ? date.getMinutes() : ("0" + (date.getMinutes()));
    let result = date.getFullYear()+"-"+mString+"-"+dString+" "+hString+":"+mntString;
    
    return result;
  }
export const baseURL = "http://localhost:3009";
export function getDateFormatted(date:Date){
    let mString = (date.getMonth() + 1) > 9 ? (date.getMonth() + 1) : ("0" + (date.getMonth() + 1));
    let dString = (date.getDate()) > 9 ? date.getDate() : ("0" + (date.getDate()));
    let hString = (date.getHours()) > 9 ? date.getHours() : ("0" + (date.getHours()));
    let mntString = (date.getMinutes()) > 9 ? date.getMinutes() : ("0" + (date.getMinutes()));
    let result = date.getFullYear()+"-"+mString+"-"+dString+" "+hString+":"+mntString;
    
    return result;
  }
  export function verifyDate(d) {
    var re = /^\d{4}-(0[1-9]|1[0-2])-([0-2]\d|3[01]) (0\d|1[01]):[0-5]\d:[0-5]\d$/;
    //         yyyy -       MM      -       dd           hh     :   mm  :   ss
    return re.test(d);
  }
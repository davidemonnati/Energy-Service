import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class CompareService {

  constructor() { }

  selectDate(dateSingle: FormControl, url1: string, url2?: string): string[] {
    let urlToReturn2;
    const day = dateSingle.value.getDate();
    const month = dateSingle.value.getMonth() + 1;
    const year = dateSingle.value.getFullYear();

    const urlToReturn1 = url1 + year + '/' + month + '/' + day ;
    if(url2 !== undefined){
      urlToReturn2 = url2 + year + '/' + month + '/' + day ;
      return new Array(urlToReturn1, urlToReturn2);
    }

    return new Array(urlToReturn1);
  }

  selectRangeDate(startDate: FormControl, endDate: FormControl, url1: string, url2?: string): string[] {
    let urlToReturn2;
    const day1 = startDate.value.getDate();
    const month1 = startDate.value.getMonth() + 1;
    const year1 = startDate.value.getFullYear();

    const day2 = endDate.value.getDate();
    const month2 = endDate.value.getMonth() + 1;
    const year2 = endDate.value.getFullYear();

    const urlToReturn1 = url1 + year1 + '/' + month1 + '/' + day1 + '/'+ year2 + '/' + month2 + '/' + day2;

    if(url2 !== undefined){
      urlToReturn2 = url2 + year1 + '/' + month1 + '/' + day1 + '/'+ year2 + '/' + month2 + '/' + day2;
      return new Array(urlToReturn1, urlToReturn2);
    }

    return new Array(urlToReturn1);
  }
}

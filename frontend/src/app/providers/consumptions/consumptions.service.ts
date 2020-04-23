import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ConsumptionsService {

  constructor( private httpClient: HttpClient ) { }

  private extractData(res: Response) {
    const body = res;
    return body || {};
  }

  getConsumption(url: string): Observable<any> {
    return this.httpClient.get(url).pipe(
      map(this.extractData)
    );
  }
}

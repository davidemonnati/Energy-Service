import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Apartment } from 'src/app/models/apartments';
import { environment } from 'src/environments/environment.prod';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ApartmentsService {

  constructor(
    private httpClient: HttpClient,
  ) { }

  private url = environment.BACKEND_ADDR + '/apartments';

  getApartments(): Observable<Apartment[]> {
    return this.httpClient.get<Apartment[]>(this.url);
  }

  createApartment(form: FormGroup): Observable<any> {
    return this.httpClient.post(environment.BACKEND_ADDR + '/apartments', {
      row: form.value['row'],
      number: form.value['number'],
      description: form.value['description']
    })
  }

  deleteApartment(row: string, number: string): Promise<boolean> {
    console.log(row);
    console.log(number);
    return new Promise(resolve => {
      this.httpClient.delete(environment.BACKEND_ADDR + '/apartments/' + row +'/' + number)
      .subscribe ((val: any) => {
        console.log('Apartment deleted successful... ' + val)
      }, err => {
        resolve(err)})
    })
  }
}

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

  createApartment(form: FormGroup): void {
    this.httpClient.post(environment.BACKEND_ADDR + '/apartments', {
      row: form.value['row'],
      number: form.value['number'],
      description: form.value['description']
    })
    .subscribe((val) => {
      console.log('Apartment created successful...', val);
      return true;
    })
  }

  createApartmentNew(form: FormGroup): Promise<boolean> {
    return new Promise(resolve =>{
      this.httpClient.post(environment.BACKEND_ADDR + '/apartments', {
        row: form.value['row'],
        number: form.value['number'],
        description: form.value['description']
      })
      .subscribe((val: any) => {
        console.log('Apartment created successful...', val);
      })
    })
  }
}

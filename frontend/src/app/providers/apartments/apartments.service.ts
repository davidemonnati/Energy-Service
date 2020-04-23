import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Apartment } from 'src/app/models/apartments';
import { environment } from 'src/environments/environment.prod';

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
}

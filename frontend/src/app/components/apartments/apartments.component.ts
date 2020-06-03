import { Component, OnInit } from '@angular/core';
import { ApartmentsService } from 'src/app/providers/apartments/apartments.service';
import { Apartment } from 'src/app/models/apartments';

@Component({
  selector: 'app-apartments',
  templateUrl: './apartments.component.html',
  styleUrls: ['./apartments.component.css']
})
export class ApartmentsComponent implements OnInit {

  public apartments = [];
  public openOptions = false;

  constructor(
    private apartmentService: ApartmentsService
  ) { }

  async ngOnInit() {
    this.getApartments();
  }

  clickOptionsButton() {
    this.openOptions = !this.openOptions;
  }

  getApartments(): void {
    this.apartmentService.getApartments().subscribe((data: Apartment[]) => {
      this.apartments = data;
    });
  }
}

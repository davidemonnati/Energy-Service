import { Component, OnInit } from '@angular/core';
import { ApartmentsService } from 'src/app/providers/apartments/apartments.service';
import { Apartment } from 'src/app/models/apartments';

@Component({
  selector: 'app-comparison',
  templateUrl: './comparison.component.html',
  styleUrls: ['./comparison.component.css']
})
export class ComparisonComponent implements OnInit {

  public apartments = [];
  valueFirst: string;
  valueSecond: string;

  constructor(private apartmentService: ApartmentsService) { }

  ngOnInit() {
    this.getApartments();
  }

  private getApartments(): void {
    this.apartmentService.getApartments().subscribe((data: Apartment[]) => {
      this.apartments = data;
    });
  }
}

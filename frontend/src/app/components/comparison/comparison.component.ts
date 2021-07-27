import { Component, OnInit } from '@angular/core';
import { ApartmentsService } from 'src/app/providers/apartments/apartments.service';
import { Apartment } from 'src/app/models/apartments';
import { Router } from '@angular/router';

@Component({
  selector: 'app-comparison',
  templateUrl: './comparison.component.html',
  styleUrls: ['./comparison.component.css']
})
export class ComparisonComponent implements OnInit {

  public apartments = [];
  public valueFirst: string;
  public valueSecond: string;
  public error = false;
  public errorMessage: string;

  constructor(
    private apartmentService: ApartmentsService,
    private router: Router) { }

  ngOnInit() {
    this.getApartments();
  }

  private getApartments(): void {
    this.apartmentService.getApartments().subscribe((data: Apartment[]) => {
      this.apartments = data;
    });
  }

  public compare(): void {
    this.error = false;
    if(this.valueFirst === this.valueSecond){
      this.error = true;
      this.errorMessage = 'Non puoi eseguire il confronto di due appartamenti uguali.';
    }

    if(this.valueFirst === undefined || this.valueSecond === undefined) {
      this.errorMessage = 'Per fare il confronto devi selezionare entrambi gli appartamenti.';
      this.error = true;
    }

    if(this.error === false) {
      this.router.navigate(['/graphcompare', this.valueFirst, this.valueSecond]);
    }
  }

  public checkValidity(): boolean {
    if(this.valueFirst === null || this.valueSecond === null) {
      this.error = true;
      return false;
    }

    return true;
  }
}

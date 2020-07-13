import { Component, OnInit } from '@angular/core';
import { ApartmentsService } from 'src/app/providers/apartments/apartments.service';
import { Apartment } from 'src/app/models/apartments';
import { MatDialog } from '@angular/material/dialog';
import { AddHomeComponent } from './add-home/add-home.component';

@Component({
  selector: 'app-apartments',
  templateUrl: './apartments.component.html',
  styleUrls: ['./apartments.component.css']
})
export class ApartmentsComponent implements OnInit {

  public apartments = [];
  public openOptions = false;
  private row: string;
  private number: string;
  private description: string;

  constructor(
    private apartmentService: ApartmentsService,
    public dialog: MatDialog
  ) { }

  async ngOnInit() {
    this.getApartments();
    this.dialog.afterAllClosed.subscribe(() => {
      this.getApartments() });
  }

  clickOptionsButton() {
    this.openOptions = !this.openOptions;
  }

  openDialog() {
    this.openOptions = false;
    this.dialog.open(AddHomeComponent, {
      data: {row: this.row, number: this.number, description: this.description}
    });
  }

  getApartments(): void {
    this.apartmentService.getApartments().subscribe((data: Apartment[]) => {
      this.apartments = data;
    });
  }
}

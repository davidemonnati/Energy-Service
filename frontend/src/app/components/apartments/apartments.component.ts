import { Component, OnInit } from '@angular/core';
import { ApartmentsService } from 'src/app/providers/apartments/apartments.service';
import { Apartment } from 'src/app/models/apartments';
import { MatDialog } from '@angular/material/dialog';
import { AddHomeComponent } from './add-home/add-home.component';
import { DeleteHomeComponent } from './delete-home/delete-home.component';

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
  public deleteMode = false;

  constructor(
    private apartmentService: ApartmentsService,
    public dialog: MatDialog
  ) { }

  async ngOnInit() {
    this.getApartments();
    this.dialog.afterAllClosed.subscribe(() => {
      this.getApartments() });
  }

  clickOptionsButton(): void {
    this.openOptions = !this.openOptions;
  }

  openDialog(): void {
    this.openOptions = false;
    this.dialog.open(AddHomeComponent, {
      data: {row: this.row, number: this.number, description: this.description}
    });
  }

  openDeleteDialog(row: string, number: string): void {
    this.row = row;
    this.number = number;
    this.dialog.open(DeleteHomeComponent, {
      data: {
        row: this.row,
        number: this.number
      }
    });
  }

  getApartments(): void {
    this.apartmentService.getApartments().subscribe((data: Apartment[]) => {
      this.apartments = data;
    });
  }

  changeDeleteMode(): void {
    this.deleteMode = !this.deleteMode;
    this.openOptions = false;
  }
}

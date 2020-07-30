import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Apartment } from 'src/app/models/apartments';
import { ApartmentsService } from 'src/app/providers/apartments/apartments.service';

@Component({
  selector: 'app-delete-home',
  templateUrl: './delete-home.component.html',
  styleUrls: ['./delete-home.component.css']
})
export class DeleteHomeComponent {
  public row;
  public number;

  constructor(
    private apartmentsService: ApartmentsService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<DeleteHomeComponent>,
    @Inject(MAT_DIALOG_DATA) {row, number}: Apartment) {
      this.row = row;
      this.number = number;
    }

    deleteApartment(){
      this.apartmentsService.deleteApartment(this.row, this.number);
      this.showSnackBar();
    }

    showSnackBar() {
      this.snackBar.open("L'Appartamento " +  this.row + '/' + this.number + ' è stato eliminato!', 'close', {duration: 3000});
    }
}

import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Apartment } from 'src/app/models/apartments';
import { ApartmentsService } from 'src/app/providers/apartments/apartments.service';

@Component({
  selector: 'app-add-home',
  templateUrl: './add-home.component.html',
  styleUrls: ['./add-home.component.css']
})
export class AddHomeComponent {
  form: FormGroup;
  value: string;
  error = false;

  constructor(
    private snackBar: MatSnackBar,
    private apartmentsService: ApartmentsService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddHomeComponent>,
    @Inject(MAT_DIALOG_DATA) {row, number, description}: Apartment) {
      this.form = fb.group({
        row: [row, Validators.required],
        number: [number, Validators.required],
        description: [description]
      })
    }

    createApartment(): void {
      if(!this.errorCheckFields()) {
        this.apartmentsService.createApartmentNew(this.form);
        this.showSnackBar();
        this.dialogRef.close();
      }
    }

    errorCheckFields(): boolean {
      if(this.form.value['row'] === null || this.form.value['number'] === null) {
        this.error = true;
        return true;
      }

      return false;
    }

    showSnackBar() {
      this.snackBar.open('Appartamento creato!', 'close', {duration: 3000});
    }
}

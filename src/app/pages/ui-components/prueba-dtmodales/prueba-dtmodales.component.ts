import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';

/*Tooltip*/
import { MatCardModule } from '@angular/material/card'; // Importa MatCardModule
import { MatButtonModule } from '@angular/material/button'; // Importa MatButtonModule
import { MatTooltipModule } from '@angular/material/tooltip'; // Importa MatTooltipModule

/*Modal*/
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';


export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

// Datos de ejemplo
const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
  { position: 11, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 12, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 13, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 14, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { position: 15, name: 'Boron', weight: 10.811, symbol: 'B' },
  { position: 16, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { position: 17, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { position: 18, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { position: 19, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { position: 20, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
];

@Component({
  selector: 'app-prueba-dtmodales',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule,

    MatCardModule,
    MatButtonModule,
    MatTooltipModule,

    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,

  ],
  templateUrl: './prueba-dtmodales.component.html',
  styleUrl: './prueba-dtmodales.component.scss'
})


export class PruebaDTModalesComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit() {
    // Configura la fuente de datos
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator; // Vincula el paginador al DataSource
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage(); // Reinicia el paginador si se aplica un filtro
    }
  }


  /*Logica del form y modal*/

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {
    this.form = this.fb.group({
      no: ['', Validators.required],
      name: ['', Validators.required],
      weight: ['', [Validators.required, Validators.min(0)]],
      symbol: ['', Validators.required],
    });
  }

  openModal() {
    const dialogRef = this.dialog.open(ModalFormComponent, {
      width: '400px',
      data: { form: this.form },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Form Data:', result); // Aquí manejas los datos enviados desde el formulario
      } else {
        console.log('Modal closed without data');
      }
    });
  }

  /*Fin form y modal*/

}




/* Form y Modal*/
@Component({
  selector: 'app-modal-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  template: `
    <h2 mat-dialog-title>Add New Item</h2>
    <mat-dialog-content>
      <form [formGroup]="form">
        <mat-form-field appearance="fill" class="full-width">
          <mat-label>No</mat-label>
          <input matInput formControlName="no" />
          <mat-error *ngIf="form.get('no')?.hasError('required')">No is required</mat-error>
        </mat-form-field>

        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Name</mat-label>
          <input matInput formControlName="name" />
          <mat-error *ngIf="form.get('name')?.hasError('required')">Name is required</mat-error>
        </mat-form-field>

        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Weight</mat-label>
          <input matInput type="number" formControlName="weight" />
          <mat-error *ngIf="form.get('weight')?.hasError('required')">Weight is required</mat-error>
        </mat-form-field>

        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Symbol</mat-label>
          <input matInput formControlName="symbol" />
          <mat-error *ngIf="form.get('symbol')?.hasError('required')">Symbol is required</mat-error>
        </mat-form-field>
      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button (click)="onClose()">Cancel</button>
      <button mat-flat-button color="primary" (click)="onSubmit()" [disabled]="form.invalid">
        Submit
      </button>
    </mat-dialog-actions>
  `,
  styleUrls: ['./prueba-dtmodales.component.scss']
})
export class ModalFormComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ModalFormComponent>
  ) {
    this.form = this.fb.group({
      no: ['', Validators.required],
      name: ['', Validators.required],
      weight: ['', [Validators.required, Validators.min(0)]],
      symbol: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value); // Cierra el modal y pasa los datos
    }
  }

  onClose() {
    this.dialogRef.close(); // Cierra el modal sin enviar datos
  }
}
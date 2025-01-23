import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MaterialModule } from 'src/app/material.module';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { ApiService } from 'src/app/services/api.service';
import { Craft } from 'src/app/interfaces/crafts.interface';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

/* export interface productsData {
  name: string;
  area: string;
  price: number;
  Dimensions: string; //tamano de instalacion
  materialUsed: string;//materiales que se utilizaran
  leadTime: string; //duración del proyecto
  description: string;
} */


const PRODUCT_DATA: Craft[] = [];


@Component({
  selector: 'app-crafts',
  standalone: true,
  imports: [
    MatTableModule,
        CommonModule,
        MatCardModule,
        MaterialModule,
        MatIconModule,
        MatMenuModule,
        MatButtonModule,
        MatDialogModule
  ],
  templateUrl: './crafts.component.html',
  styleUrl: './crafts.component.scss'
})
export class CraftsComponent implements OnInit{

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
   // table 1
   displayedColumns1: string[] = ['test', 'test', 'test', 'test'];
   // dataSource1 = PRODUCT_DATA;
   dataSource1 = new MatTableDataSource( PRODUCT_DATA );

  form: FormGroup;

  constructor( 
    private apiservice: ApiService<Craft>, 
    private dialog: MatDialog,
    private fb: FormBuilder
   ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      area: ['', Validators.required],
      price: ['', Validators.required],
      Dimensions: ['', Validators.required], //tamano de instalacion
      materialUsed: ['', Validators.required],//materiales que se utilizaran
      leadTime: ['', Validators.required], //duración del proyecto
      description: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    // this.tst();
    // this.tst2();
    // this.updatetst2();
  }
  
  async tst(){
    //const response = await this.apiService.callPostApi(url, undefined,{"postedDate": postDateToUTC}).toPromise();
    const resps = await this.apiservice.findAll('crafts').toPromise();
    console.log({resps})

  }

  async tst2() {
    const data = {
      "name": "Wooden Sculpture",
      "area": "Interior Design",
      "price": 1200,
      "Dimensions": "2m x 1.5m x 0.5m",
      "materialUsed": "Oak Wood, Resin",
      "leadTime": "3 weeks",
      "description": "A handcrafted wooden sculpture perfect for modern interior decoration."
    }
    const resps = await this.apiservice.create('crafts/create', data).toPromise();
    console.log({resps})
  }
  
  async updatetst2() {
    const data = {
      "name": "Wooden 3 Sculpture",
      "area": "Interior Design 2",
      "price": 1200,
      "Dimensions": "2m x 1.5m x 0.5m",
      "materialUsed": "Oak Wood, Resin",
      "leadTime": "6 weeks",
      "description": "A handcrafted wooden sculpture perfect for modern interior decoration."
    }
    const resps = await this.apiservice.update('crafts', "67873c05d96e876ec8275c4b", data).toPromise();
    console.log({resps})
  }
 


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource1.filter = filterValue.trim().toLowerCase();

    if (this.dataSource1.paginator) {
      this.dataSource1.paginator.firstPage(); // Reinicia el paginador si se aplica un filtro
    }
  }

    /*Logica del form y modal*/
  
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
  styleUrls: ['./crafts.component.scss']
})
export class ModalFormComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ModalFormComponent>
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      area: ['', Validators.required],
      price: ['', Validators.required],
      Dimensions: ['', Validators.required], //tamano de instalacion
      materialUsed: ['', Validators.required],//materiales que se utilizaran
      leadTime: ['', Validators.required], //duración del proyecto
      description: ['', Validators.required],
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

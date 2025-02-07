/*import { Component } from '@angular/core';

@Component({
  selector: 'app-areas',
  standalone: true,
  imports: [],
  templateUrl: './areas.component.html',
  styleUrl: './areas.component.scss'
})
export class AreasComponent {

}
*/

import { AfterViewInit, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MaterialModule } from 'src/app/material.module';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { ApiService } from 'src/app/services/api.service';
import { AreaInterface } from 'src/app/interfaces/areas.interface';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatGridListModule } from '@angular/material/grid-list';


@Component({
  selector: 'app-areas',
  standalone: true,
  imports: [
    MatTableModule,
    CommonModule,
    MatCardModule,
    MaterialModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    MatDialogModule,
  ],
  templateUrl: './areas.component.html',
  styleUrl: './areas.component.scss'
})
export class AreasComponent implements OnInit, AfterViewInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  PRODUCT_DATA: AreaInterface[] = [];
   // table 1
   displayedColumns: string[] = [
    'Room', 
    'RoomName', 
    'Craft', 
    'Area', 
    'Price', 
    'Direction',
    'Type',
    'SF',
    'Disposal20',
    'TotalSqFt',
    'Bidder',
    'Total',
    'actions'
  ];
   // dataSource1 = PRODUCT_DATA;
  dataSource = new MatTableDataSource<AreaInterface>( this.PRODUCT_DATA );
  //  dataSource: MatTableDataSource<Craft, MatPaginator> = [];

  form: FormGroup;

  constructor( 
    private apiservice: ApiService<AreaInterface>, 
    private dialog: MatDialog,
    private fb: FormBuilder
   ) {

    this.form = this.fb.group({
      Room: ['', Validators.required],
      RoomName: ['', Validators.required],
      Craft: ['', Validators.required],
      Area: ['', Validators.required], 
      Price: ['', Validators.required],
      Direction: ['', Validators.required], 
      Type: ['', Validators.required],
      SF: ['', Validators.required],
      Disposal20: ['', Validators.required],
      TotalSqFt: ['', Validators.required],
      Bidder: ['', Validators.required],
      Total: ['', Validators.required],
    });

    this.getAreas();

  }
  
  ngOnInit(): void {
    // Configura la fuente de datos
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator; // Vincula el paginador al DataSource
  }
  
  async getAreas(){
    //const response = await this.apiService.callPostApi(url, undefined,{"postedDate": postDateToUTC}).toPromise();
    const resps = await this.apiservice.findAll('areas').toPromise();
    console.log({resps})
    // this.dataSource = new MatTableDataSource( resps );
    this.PRODUCT_DATA = [...resps]; // Ensure immutability
    this.dataSource.data = this.PRODUCT_DATA;

    // Reassign paginator and sort to reflect updates correctly
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

  }

  async createAreas( area: AreaInterface ) {
    /* 
    const resps = await this.apiservice.create('crafts/create', data).toPromise();
     */
    const result = await this.apiservice.create('areas/create', area).toPromise();
    console.log('create function', result)

    this.getAreas();

  }
  
  async updateArea( area: AreaInterface ) {

    const { _id } = area;
    
    // const resps = await this.apiservice.update('crafts', "67873c05d96e876ec8275c4b", data).toPromise();
    const resps = await this.apiservice.update('areas', _id!, area).toPromise();
    
    this.getAreas();
  }
 

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage(); // Reinicia el paginador si se aplica un filtro
    }
  }

    /*Logica del form y modal*/
  
  openModal( element:any ) {
    const dialogRef = this.dialog.open(ModalFormComponent, {
      width: '400px',
      data: { form: element },
      // data: { form: this.form },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        console.log('Form Data:', result); // Aquí manejas los datos enviados desde el formulario
        
        if ( result._id === '' ) {
          this.createAreas( result );
          return;
        }

        this.updateArea( result );
        
      } else {
        console.log('Modal closed without data');
      }
    });
  }
  
    /*Fin form y modal*/
}



@Component({
  selector: 'app-areas-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatGridListModule
  ],
  templateUrl: './areas-modal.component.html',
  styleUrls: ['./areas.component.scss']
})
export class ModalFormComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ModalFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any // Inject the data passed to the modal
  ) {
    // Initialize the form with the passed data (element)
    this.form = this.fb.group({
      _id: [this.data.form._id || ''],
      Room: [this.data.form.Room || '', Validators.required],
      RoomName: [this.data.form.RoomName || '', Validators.required],
      Craft: [this.data.form.Craft || '', Validators.required],
      Area: [this.data.form.Area || '', Validators.required],
      Price: [this.data.form.Price || '', Validators.required],
      Direction: [this.data.form.Direction || '', Validators.required],
      Type: [this.data.form.Type || '', Validators.required],
      SF: [this.data.form.SF || '', Validators.required],
      Disposal20: [this.data.form.Disposal20 || '', Validators.required],
      TotalSqFt: [this.data.form.TotalSqFt || '', Validators.required],
      Bidder: [this.data.form.Bidder || '', Validators.required],
      Total: [this.data.form.Total || '', Validators.required],
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

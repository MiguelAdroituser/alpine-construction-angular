

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
import { Customer } from 'src/app/interfaces/customers.interface';

/* 
@Prop({ type: mongoose.Schema.Types.ObjectId, ref: Customer.name, required: true })
    customerId: mongoose.Types.ObjectId; //It contains the customer Id and project Id.

    @Prop({ required: true })
    room: number;

    @Prop({ required: true })
    roomName: string;

    @Prop({ required: true })
    craft: string;

    @Prop({ required: true })
    area: string;

    @Prop({ required: true })
    price: number;

    @Prop({ required: true })
    direction: string;

    @Prop({ required: true })
    cantidad: number;

    @Prop({ required: true })
    disposal: number;

    @Prop({ required: true })
    totalCantidad: number;

    @Prop({ required: true })
    bidden: number;

    @Prop({ required: true })
    total: number;

    @Prop({ required: true })
    unidadUsa: string;

    @Prop({ required: true })
    unidadMx: string;

    @Prop({ required: true })
    cantidadUsa: number;

    @Prop({ required: true })
    cantidadMx: number;
*/
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
    'room', 
    'roomName', 
    'craft', 
    'area', 
    'price', 
    'direction',
    'type',
    'cantidad',
    'disposal',
    'totalCantidad',
    'bidden',
    'total',
    'actions'
  ];
 
  dataSource = new MatTableDataSource<AreaInterface>( this.PRODUCT_DATA );

  form: FormGroup;

  /* Customers config selector */
  customers: Customer[] = [];

  selectedCustomer: string | null = null;

  constructor( 
    private apiservice: ApiService<AreaInterface>, 
    private dialog: MatDialog,
    private fb: FormBuilder
   ) {

    this.form = this.fb.group({
      room: ['', Validators.required],
      roomName: ['', Validators.required],
      craft: ['', Validators.required],
      area: ['', Validators.required], 
      price: ['', Validators.required],
      direction: ['', Validators.required], 
      type: ['', Validators.required],
      cantidad: ['', Validators.required],
      disposal: ['', Validators.required],
      totalCantidad: ['', Validators.required],
      bidden: ['', Validators.required],
      total: ['', Validators.required],

      unidadUsa: ['sqft', Validators.required],
      unidadMx: ['m3', Validators.required],
      cantidadUsa: ['2345', Validators.required],
      cantidadMx: ['2345', Validators.required],
    });

    this.getAreas();
    this.getCustomers();

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
    
    const resps = await this.apiservice.findAll('areas').toPromise();
    console.log({resps})
    
    this.PRODUCT_DATA = [...resps]; // Ensure immutability
    this.dataSource.data = this.PRODUCT_DATA;

    // Reassign paginator and sort to reflect updates correctly
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

  }

  async getCustomers(){
    
    try {
      const customers = await this.apiservice.findAll('customers').toPromise();
      console.log({ customers });
      this.customers = customers;
  
      if (customers.length > 0) {
        this.selectedCustomer = customers[1]._id; // Default selection
        this.onCustomerChange(this.selectedCustomer); // Trigger additional logic
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
    }

  }

  async createAreas( area: AreaInterface ) {
    /* 
    const resps = await this.apiservice.create('crafts/create', data).toPromise();
     */
    const result = await this.apiservice.create('areas/create', {...area, customerId: this.selectedCustomer! }).toPromise();
    console.log('create function', result)

    this.getAreas();

  }
  
  async updateArea( area: AreaInterface ) {

    const { _id } = area;
    
    // const resps = await this.apiservice.update('crafts', "67873c05d96e876ec8275c4b", data).toPromise();
    const resps = await this.apiservice.update('areas', _id!, area).toPromise();
    
    this.getAreas();
  }
 
  onCustomerChange(customerId: string | null) {
    console.log('Selected Customer ID:', customerId);
  
    // Find the selected customer object
    const selected = this.customers.find(c => c._id === customerId);
    if (selected) {
      console.log('Selected Customer:', selected);
  
      // Perform additional logic here (e.g., update another field)
    }
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
      room: [this.data.form.room || '', Validators.required],
      roomName: [this.data.form.roomName || '', Validators.required],
      craft: [this.data.form.craft || '', Validators.required],
      area: [this.data.form.area || '', Validators.required],
      price: [this.data.form.price || '', Validators.required],
      direction: [this.data.form.direction || '', Validators.required],
      type: [this.data.form.type || '', Validators.required],
      cantidad: [this.data.form.cantidad || '', Validators.required],
      disposal: [this.data.form.disposal || '', Validators.required],
      totalCantidad: [this.data.form.totalCantidad || '', Validators.required],
      bidden: [this.data.form.bidden || '', Validators.required],
      total: [this.data.form.total || '', Validators.required],

      unidadUsa: [this.data.form.unidadUsa || '', Validators.required],
      unidadMx: [this.data.form.unidadMx || '', Validators.required],
      cantidadUsa: [this.data.form.cantidadUsa || '', Validators.required],
      cantidadMx: [this.data.form.cantidadMx || '', Validators.required],
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

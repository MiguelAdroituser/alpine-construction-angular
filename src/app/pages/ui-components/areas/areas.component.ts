

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
import { HttpParams } from '@angular/common/http';
import { Craft } from 'src/app/interfaces/crafts.interface';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { Subscription } from 'rxjs';

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
      craftId: ['', Validators.required],
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

      unidadUsa: ['sqft'],
      unidadMx: ['m3'],
      cantidadUsa: ['2345'],
      cantidadMx: ['2345'],
    });

    this.getAreas();
    this.getCustomers();
    // this.getCrafts();

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
    const params = new HttpParams().set('customerId', this.selectedCustomer || '');
    
    try {

      const resps = await this.apiservice.callGetApi<any>('areas', params).toPromise();
      console.log({ resps });
      this.PRODUCT_DATA = [...resps]; // Ensure immutability
      this.dataSource.data = this.PRODUCT_DATA;
   
      // Reassign paginator and sort to reflect updates correctly
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

    } catch (error) {
      console.error('Error fetching areas:', error);
    }
    
   /*  const resps = await this.apiservice.findOne('areas', this.selectedCustomer).toPromise();
    console.log({resps}) */


  }

  /* async getCrafts(){
    
    const crafts = await this.apiservice.findAll('crafts').toPromise();
    console.log({crafts})

  } */

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
      this.getAreas();
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
    MatGridListModule,
    MatSelectModule,
    MatOptionModule
  ],
  templateUrl: './areas-modal.component.html',
  styleUrls: ['./areas.component.scss']
})
export class ModalFormComponent implements OnInit{
  form: FormGroup;
  private bs!: Subscription | undefined;
  craftOptions: Craft[] = [];
  directions: string[] = ['North', 'East', 'South', 'West'];
  unitMappings: { [key: string]: string } = {
    'LB': 'KG',
    'FT2': 'M2',
    'FT3': 'M3',
    'FT': 'ML'
  };
  

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ModalFormComponent>,
    private apiservice: ApiService<any>, 
    @Inject(MAT_DIALOG_DATA) public data: any // Inject the data passed to the modal
  ) {
    // Initialize the form with the passed data (element)
    this.form = this.fb.group({
      _id: [this.data.form._id || ''],
      room: [this.data.form.room || '', Validators.required],
      roomName: [this.data.form.roomName || '', Validators.required],
      craft: [this.data.form.craft || '', Validators.required],
      craftId: [this.data.form.craftId || '', Validators.required],
      area: [this.data.form.area || '', Validators.required],
      price: [this.data.form.price || '', Validators.required],
      direction: [this.data.form.direction || 'North', Validators.required],
      type: [this.data.form.type || '', Validators.required],
      cantidad: [this.data.form.cantidad || '', Validators.required],
      disposal: [this.data.form.disposal || '', Validators.required],
      totalCantidad: [this.data.form.totalCantidad || '', Validators.required],
      bidden: [this.data.form.bidden || '', Validators.required],
      total: [this.data.form.total || '', Validators.required],
      unidadUsa: [this.data.form.unidadUsa || 'LB', Validators.required],
      unidadMx: [{ value: this.unitMappings['LB'], disabled: true }, Validators.required], // Readonly MX unit
      cantidadUsa: [this.data.form.cantidadUsa || ''],
      cantidadMx: [this.data.form.cantidadMx || ''],
    });
  }
  ngOnInit(): void {
    // throw new Error('Method not implemented.');
    this.loadCraftOptions();
    this.craftIdSuscription();
    this.unidadUsaSubscription();
    this.cantidadSubscription();
  }

  cantidadSubscription(): void {
    this.form.get('cantidad')!.valueChanges.subscribe(value => {
      const unidadUsa = this.form.get('unidadUsa')!.value;
      const cantidadMx = this.convertToMxUnit(value, unidadUsa);

      // Get selected craft and area from the form
      const selectedCraft = this.form.get('craft')!.value;
      const selectedArea = this.form.get('area')!.value;

      // Find the craft object in the craftOptions array
      const craft = this.craftOptions.find(c => c.name === selectedCraft && c.area === selectedArea);

      // Get the price, default to 0 if not found
      const price = craft ? ( craft.price * value ) : 0;
      
      // Calculate total price
      // const total = price * value;

      this.form.patchValue({
        cantidadUsa: value,
        cantidadMx: cantidadMx,
        price: price, // Update the form's price field
        // total: total  // Update the total field
      }, { emitEvent: false }); // Prevent triggering valueChanges again
    });
  }

  convertToMxUnit(value: number, unidadUsa: string): number {
    if (!value || isNaN(value)) return 0;
  
    const conversionRates: { [key: string]: number } = {
      'LB': 1 / 2.205, // Convert LB to KG
      'FT2': 1 / 10.76, // Convert FT2 to M2
      'FT3': 1 / 35.31, // Convert FT3 to M3
      'FT': 1 / 3.28 // Convert FT to ML
    };
  
    return conversionRates[unidadUsa] ? +(value * conversionRates[unidadUsa]).toFixed(2) : value;
  }

  craftIdSuscription() {
    
    this.bs = this.form.get('craftId')?.valueChanges.subscribe(craftId => {
      console.log('craftId changes:', craftId);
  
      // Find the selected craft from craftOptions
      const selectedCraft = this.craftOptions.find(option => option._id === craftId);
  
      if (selectedCraft) {
        this.form.patchValue({
          craft: selectedCraft.name,
          area: selectedCraft.area
        });
      }
    });
  }

  unidadUsaSubscription() {
    this.bs = this.form.get('unidadUsa')?.valueChanges.subscribe(unidadUsa => {
      console.log('unidadUsa changes:', unidadUsa);
  
      // Mapping of USA to MX units
      const unitMapping: { [key: string]: string } = {
        'LB': 'KG',
        'FT2': 'M2',
        'FT3': 'M3',
        'FT': 'ML'
      };
  
      // Update unidadMx based on the selected unidadUsa
      this.form.patchValue({
        unidadMx: unitMapping[unidadUsa] || ''
      });
    });
  }

  ngOnDestroy(): void {
    // Desuscribirse de todas las suscripciones para evitar pérdidas de memoria.
    this.bs?.unsubscribe();
  }

  async loadCraftOptions() {

    const crafts = await this.apiservice.findAll('crafts').toPromise();
    console.log({crafts})
    this.craftOptions = crafts;
  }

  // Getter methods for Angular template
  get usaUnits(): string[] {
    return Object.keys(this.unitMappings);
  }

  get mxUnits(): string[] {
    return Object.values(this.unitMappings);
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

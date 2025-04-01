

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

//Nuevo Manuel
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Project } from 'src/app/interfaces/projects.interface';

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
  projects: Project[] = [];

  selectedCustomer: string | null = null;
  selectedProject: string | null = null;

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

      unidadUsa: [''],
      unidadMx: [''],
      cantidadUsa: [''],
      cantidadMx: [''],


      //NuevoManuel CheckBoxes
      checkbox_Straight: [false],
      checkbox_45_Angle: [false],
      checkbox_Brick: [false],
      checkbox_Random: [false],
      checkbox_Designs: [false],
      checkbox_Medalions: [false],
      checkbox_Heated_Floors: [false],
      checkbox_Steam_Showers: [false],
      checkbox_Shower_Pan: [false],
      checkbox_Benches: [false],
    });

    // this.getAreas();
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
    const params = new HttpParams()
    .set('customerId', this.selectedCustomer || '')
    .set('projectId', this.selectedProject || '');
    
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
    const result = await this.apiservice.create('areas/create', {...area, customerId: this.selectedCustomer!, projectId: this.selectedProject! }).toPromise();
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

      // this.getAreas();
      this.getProjects();
      // Perform additional logic here (e.g., update another field)
    }
  }

  onProjectChange(projectId: string | null) {
    console.log('Selected Project ID:', projectId);
  
    // Find the selected project object
    const selected = this.projects.find(p => p._id === projectId);
    if (selected) {
      console.log('Selected Project:', selected);
      
      // Store the selected project ID
      // this.selectedProject = selected._id;
      
      // Fetch areas based on the selected customer and project
      this.getAreas();
    }
  }

  async getProjects(){
    const params = new HttpParams().set('customerId', this.selectedCustomer || '');
    
    try {

      const projects = await this.apiservice.callGetApi<any>('projects', params).toPromise();
      console.log({ projects });

      this.projects = projects; // Store the projects array

    if (projects.length > 0) {
      this.selectedProject = projects[0]._id; // Select first project
      this.getAreas(); // Fetch areas based on customer & project
    } else {
      this.selectedProject = null;
    }

    } catch (error) {
      console.error('Error fetching areas:', error);
    }
    
   /*  const resps = await this.apiservice.findOne('areas', this.selectedCustomer).toPromise();
    console.log({resps}) */


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
    MatOptionModule,
    MatCheckboxModule, //NuevoManuel CheckBoxes
  ],
  templateUrl: './areas-modal.component.html',
  styleUrls: ['./areas.component.scss']
})
export class ModalFormComponent implements OnInit{
  private isInitializing = true;

  form: FormGroup;
  private bs!: Subscription | undefined;
  craftOptions: Craft[] = [];
  directions: string[] = ['North', 'East', 'South', 'West', 'Ceiling', 'Floor']; //Edicion Manuel
  disposalPercentage = 0.2; // 20%
  bidderPercentage = 0.05; // 5%
  private checkboxSubscriptions: Map<string, Subscription> = new Map();
  unitMappings: { [key: string]: string } = {
    'LB': 'KG',
    'FT2': 'M2',
    'FT3': 'M3',
    'FT': 'ML'
  };

  checkboxFields = [
    'checkbox_Straight',
    'checkbox_45_Angle',
    'checkbox_Brick',
    'checkbox_Random',
    'checkbox_Designs',
    'checkbox_Medalions',
    'checkbox_Heated_Floors',
    'checkbox_Steam_Showers',
    'checkbox_Shower_Pan',
    'checkbox_Benches',
  ];

  // Precios según el área seleccionada
  prices: { [key: string]: { [key: string]: number } } = {
    Flooring: {
      checkbox_Straight: 16,
      checkbox_45_Angle: 18,
      checkbox_Brick: 16.25,
      checkbox_Random: 16.50,
      checkbox_Designs: 70,
      checkbox_Medalions: 1500,
      checkbox_Heated_Floors: 21,
    },
    Walls: {
      checkbox_Straight: 20,
      checkbox_45_Angle: 22,
      checkbox_Brick: 21,
      checkbox_Random: 21,
      checkbox_Designs: 65,
    },
    Showers: {
      checkbox_Steam_Showers: 0,
      checkbox_Shower_Pan: 0,
      checkbox_Benches: 0,
    }
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
      type: [this.data.form.type || 'N/A', Validators.required],
      // cantidad: [this.data.form.cantidad || '', Validators.required],
      cantidad: [{ value: this.data.form.cantidad || '', disabled: !this.data.form.area }, Validators.required],
      disposal: [this.data.form.disposal || '', Validators.required],
      totalCantidad: [this.data.form.totalCantidad || '', Validators.required],
      bidden: [this.data.form.bidden || '', Validators.required],
      total: [this.data.form.total || '', Validators.required],
      unidadUsa: [this.data.form.unidadUsa || 'LB', Validators.required],
      unidadMx: [{ value: this.unitMappings['LB'], disabled: true }, Validators.required],
      cantidadUsa: [this.data.form.cantidadUsa || ''],
      cantidadMx: [this.data.form.cantidadMx || ''],

      //NuevoManuel Checkboxes
      checkbox_Straight: [this.data.form.checkbox_Straight || false],
      checkbox_45_Angle: [this.data.form.checkbox_45_Angle || false],
      checkbox_Brick: [this.data.form.checkbox_Brick || false],
      checkbox_Random: [this.data.form.checkbox_Random || false],
      checkbox_Designs: [this.data.form.checkbox_Designs || false],
      checkbox_Medalions: [this.data.form.checkbox_Medalions || false],
      checkbox_Heated_Floors: [this.data.form.checkbox_Heated_Floors || false],
      checkbox_Steam_Showers: [this.data.form.checkbox_Steam_Showers || false],
      checkbox_Shower_Pan: [this.data.form.checkbox_Shower_Pan || false],
      checkbox_Benches: [this.data.form.checkbox_Benches || false],
    });

    this.listenToCheckboxChanges(); // Agregar función para actualizar el campo price
    // this.areaSubscription();
  }
  async ngOnInit(): Promise<void> {
   
    await this.loadCraftOptions();
    
    this.isInitializing = true; //

    this.craftIdSuscription();
    this.unidadUsaSubscription();
    this.areaSubscription();
    this.cantidadSubscription();

    //Habilitar o deshabilitar checkboxes segun el campo area
    this.updateCheckboxes(null);

    this.isInitializing = false;
    //TODO: SE CORRIGIO LO DEL PRICE, PERO LOS CHECKBOXS NO ESTAN
    //SIENDO HABILITADOS O HABILIDADOS CORRECTAMENTEL.
  }

  /* ngAfterViewInit(): void {
    this.cantidadSubscription(); // Subscribe after Angular renders the form
    // this.recalculateValues(); // Manually trigger recalculations for pre-filled data
  } */
  
  areaSubscription() {
    this.form.get('area')?.valueChanges.subscribe(value => {
      if (this.isInitializing) return;
      console.log('value suscription', value)

      if (!value) this.form.get('cantidad')?.disable();
      else this.form.get('cantidad')?.enable();
      

      this.resetCheckboxes();

      if (value === 'Flooring' || value === 'Walls' || value === 'Showers') {
        this.updateCheckboxes(value);
      } else {
        this.updateCheckboxes(null); // Deshabilita todos los checkboxes si no es una opción válida
      }

      
    });
  }

  //Nuevo Manuel Checkboxes
  /* updateCheckboxes(area: 'Flooring' | 'Walls' | 'Showers' | null) {
    const checkboxes: Record<'Flooring' | 'Walls' | 'Showers', string[]> = {
      Flooring: ['checkbox_Straight', 'checkbox_45_Angle', 'checkbox_Brick', 'checkbox_Random', 'checkbox_Designs', 'checkbox_Medalions', 'checkbox_Heated_Floors'],
      Walls: ['checkbox_Straight', 'checkbox_45_Angle', 'checkbox_Brick', 'checkbox_Random', 'checkbox_Designs'],
      Showers: ['checkbox_Steam_Showers', 'checkbox_Shower_Pan', 'checkbox_Benches']
    };
  
    // Deshabilitar todos los checkboxes
    Object.keys(this.form.controls).forEach(key => {
      if (key.startsWith('checkbox_')) {
        this.form.get(key)?.disable();
      }
    });

    // Si el área seleccionada es válida, habilitar solo los checkboxes correspondientes
    if (area && checkboxes[area]) {
      checkboxes[area].forEach(name => {
        this.form.get(name)?.enable();
      });
    }

    // Trigger recalculation after updating checkboxes
  
  } */

  updateCheckboxes(area: 'Flooring' | 'Walls' | 'Showers' | null) {
    const checkboxes: Record<'Flooring' | 'Walls' | 'Showers', string[]> = {
      Flooring: ['checkbox_Straight', 'checkbox_45_Angle', 'checkbox_Brick', 'checkbox_Random', 'checkbox_Designs', 'checkbox_Medalions', 'checkbox_Heated_Floors'],
      Walls: ['checkbox_Straight', 'checkbox_45_Angle', 'checkbox_Brick', 'checkbox_Random', 'checkbox_Designs'],
      Showers: ['checkbox_Steam_Showers', 'checkbox_Shower_Pan', 'checkbox_Benches']
    };
  
    // Get all checkbox fields
    this.checkboxFields.forEach(field => {
      // Check if the checkbox belongs to the selected area
      const shouldEnable = area ? checkboxes[area]?.includes(field) : false;
  
      if (shouldEnable) {
        this.form.get(field)?.enable();
      } else {
        this.form.get(field)?.disable();
        this.form.get(field)?.setValue(false, { emitEvent: false }); // Ensure it's unchecked if disabled
      }
    });
  
    // Trigger recalculation after updating checkboxes
    this.recalculateValues();
  }
  
  
  // Función para desmarcar todos los checkboxes
  resetCheckboxes() {
    // Aquí desmarcamos todos los checkboxes
    const checkboxNames = [
      'checkbox_Straight',
      'checkbox_45_Angle',
      'checkbox_Brick',
      'checkbox_Random',
      'checkbox_Designs',
      'checkbox_Medalions',
      'checkbox_Heated_Floors',
      'checkbox_Steam_Showers',
      'checkbox_Shower_Pan',
      'checkbox_Benches'
    ];
    
    checkboxNames.forEach(name => {
      this.form.get(name)?.setValue(false);  // Desmarcar el checkbox
      this.form.get(name)?.disable();        // Deshabilitar el checkbox
    });
  }

  
  /* private listenToCheckboxChanges() {
    this.checkboxFields.forEach(field => {
      this.form.get(field)?.valueChanges.subscribe((isChecked: boolean) => {

        console.log('logs');
        //Si no existe una cantidad, no realizar la sumatoria o resta de checkboxes.
        if ( this.form.get('cantidad')?.value === '' ) return;

         const area = this.form.get('area')?.value;
  
        // Get current price
        let currentPrice = this.form.get('price')?.value || 0;
        let fieldPrice = this.prices[area][field] || 0;
  
        // Add or subtract based on checkbox state
        currentPrice = isChecked ? currentPrice + fieldPrice : currentPrice - fieldPrice;
  
        // Update the price
        this.form.patchValue({ price: currentPrice }, { emitEvent: false });
      });
    });
  } */

    /* private listenToCheckboxChanges() {
      this.checkboxFields.forEach(field => {
        // Unsubscribe previous subscription (if any)
        this.form.get(field)?.valueChanges.unsubscribe();
    
        this.form.get(field)?.valueChanges.subscribe((isChecked: boolean) => {
          console.log('logs');
    
          // If cantidad is empty, do nothing
          if (this.form.get('cantidad')?.value === '') return;
    
          const area = this.form.get('area')?.value;
    
          // Get current price
          let currentPrice = this.form.get('price')?.value || 0;
          let fieldPrice = this.prices[area]?.[field] || 0;
    
          // Add or subtract based on checkbox state
          currentPrice = isChecked ? currentPrice + fieldPrice : currentPrice - fieldPrice;
    
          // Update the price
          this.form.patchValue({ price: currentPrice }, { emitEvent: false });
        });
      });
    } */

      private listenToCheckboxChanges() {
        this.checkboxFields.forEach(field => {
          // Unsubscribe if a previous subscription exists
          this.checkboxSubscriptions.get(field)?.unsubscribe();
      
          // Subscribe to valueChanges and store the subscription
          const subscription = this.form.get(field)?.valueChanges.subscribe((isChecked: boolean) => {
            console.log('logs');
      
            // If cantidad is empty, do nothing
            if (this.form.get('cantidad')?.value === '') return;
      
            const area = this.form.get('area')?.value;
            let currentPrice = this.form.get('price')?.value || 0;
            let fieldPrice = this.prices[area]?.[field] || 0;
      
            // Add or subtract based on checkbox state
            currentPrice = isChecked ? currentPrice + fieldPrice : currentPrice - fieldPrice;
      
            // Update the price
            this.form.patchValue({ price: currentPrice }, { emitEvent: false });
          });
      
          // Store the new subscription
          if (subscription) {
            this.checkboxSubscriptions.set(field, subscription);
          }
        });
      }
    

  cantidadSubscription(): void {
    this.form.get('cantidad')!.valueChanges.subscribe(value => {
      if (this.isInitializing) return;

      this.recalculateValues();
    });

    // this.listenToCheckboxChanges();
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
      if (this.isInitializing) return; // Avoid premature execution
  
      // Find the selected craft from craftOptions
      const selectedCraft = this.craftOptions.find(option => option._id === craftId);
  
      // Prevent areaSubscription from triggering recursively
  
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
      if (this.isInitializing) return; 
  
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

      // Trigger recalculation manually
      this.recalculateValues();

    });
  }

  recalculateValues() {

    

    const value = this.form.get('cantidad')!.value;
    const unidadUsa = this.form.get('unidadUsa')!.value;
    const cantidadMx = this.convertToMxUnit(value, unidadUsa);
  
    const selectedCraft = this.form.get('craft')!.value;
    const selectedArea = this.form.get('area')!.value;
    const craft = this.craftOptions.find(c => c.name === selectedCraft && c.area === selectedArea);
  
    let price = craft ? (craft.price * value) : 0;
  
    if (selectedArea && this.prices[selectedArea]) {
      this.checkboxFields.forEach(field => {
        if (this.form.get(field)?.value) {
          price += this.prices[selectedArea][field] || 0;
        }
      });
    }

    console.log('recalculateValues', 'price: ', price)
    console.log('craft', craft)
    console.log('selectedCraft', selectedCraft)
    console.log('selectedArea', selectedArea)
    console.log('this.craftOptions', this.craftOptions)
  
    const disposal = Math.round(value * this.disposalPercentage);
    const totalCantidad = value + disposal;
    const bidder = price * this.bidderPercentage;
    const total = price - bidder;
  
    this.form.patchValue({
      cantidadUsa: value,
      cantidadMx: cantidadMx,
      price: price,
      disposal: disposal,
      totalCantidad: totalCantidad,
      bidden: bidder,
      total: total
    }, { emitEvent: false }); // Prevents infinite loops
  }
  

  ngOnDestroy(): void {
    // Desuscribirse de todas las suscripciones para evitar pérdidas de memoria.
    this.bs?.unsubscribe();
    this.checkboxSubscriptions.forEach(sub => sub.unsubscribe());
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
      // this.form.enable();
      const formValue  = { ...this.form.value, unidadMx: this.form.get('unidadMx')?.value }

      this.dialogRef.close( formValue ); // Cierra el modal y pasa los datos
    }
  }

  onClose() {
    this.dialogRef.close(); // Cierra el modal sin enviar datos
  }
}

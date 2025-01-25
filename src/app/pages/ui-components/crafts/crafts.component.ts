import { AfterViewInit, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MaterialModule } from 'src/app/material.module';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { ApiService } from 'src/app/services/api.service';
import { Craft } from 'src/app/interfaces/crafts.interface';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatGridListModule } from '@angular/material/grid-list';


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
        MatDialogModule,
  ],
  templateUrl: './crafts.component.html',
  styleUrl: './crafts.component.scss'
})
export class CraftsComponent implements OnInit, AfterViewInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  PRODUCT_DATA: Craft[] = [];
   // table 1
   displayedColumns: string[] = [
    'name', 
    'area', 
    'price', 
    'Dimensions', 
    'materialUsed', 
    'leadTime',
    'description',
    'actions'
  ];
   // dataSource1 = PRODUCT_DATA;
   dataSource = new MatTableDataSource<Craft>( this.PRODUCT_DATA );
  //  dataSource: MatTableDataSource<Craft, MatPaginator> = [];

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

    this.getCrafts();

  }
  
  ngOnInit(): void {
    // Configura la fuente de datos
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator; // Vincula el paginador al DataSource
  }
  
  async getCrafts(){
    //const response = await this.apiService.callPostApi(url, undefined,{"postedDate": postDateToUTC}).toPromise();
    const resps = await this.apiservice.findAll('crafts').toPromise();
    console.log({resps})
    // this.dataSource = new MatTableDataSource( resps );
    this.PRODUCT_DATA = [...resps]; // Ensure immutability
    this.dataSource.data = this.PRODUCT_DATA;

    // Reassign paginator and sort to reflect updates correctly
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

  }

  async createCraft( craft: Craft ) {
    /* 
    const resps = await this.apiservice.create('crafts/create', data).toPromise();
     */
    const result = await this.apiservice.create('crafts/create', craft).toPromise();
    console.log('create function', result)

    this.getCrafts();

  }
  
  async updateCraft( craft: Craft ) {

    const { _id } = craft;
    
    // const resps = await this.apiservice.update('crafts', "67873c05d96e876ec8275c4b", data).toPromise();
    const resps = await this.apiservice.update('crafts', _id!, craft).toPromise();
    
    this.getCrafts();
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
          this.createCraft( result );
          return;
        }

        this.updateCraft( result );
        
      } else {
        console.log('Modal closed without data');
      }
    });
  }
  
    /*Fin form y modal*/
}



@Component({
  selector: 'app-crafts-modal',
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
  templateUrl: './crafts-modal.component.html',
  styleUrls: ['./crafts.component.scss']
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
      name: [this.data.form.name || '', Validators.required],
      area: [this.data.form.area || '', Validators.required],
      price: [this.data.form.price || '', Validators.required],
      Dimensions: [this.data.form.Dimensions || '', Validators.required],
      materialUsed: [this.data.form.materialUsed || '', Validators.required],
      leadTime: [this.data.form.leadTime || '', Validators.required],
      description: [this.data.form.description || '', Validators.required],
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

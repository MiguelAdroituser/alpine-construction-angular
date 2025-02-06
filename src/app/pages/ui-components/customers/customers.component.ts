import { AfterViewInit, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MaterialModule } from 'src/app/material.module';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { ApiService } from 'src/app/services/api.service';
import { Customer } from 'src/app/interfaces/customers.interface'; //Cambiar esta en cada componente nuevo
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatGridListModule } from '@angular/material/grid-list';


@Component({
  selector: 'app-customers',
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
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.scss'
})
export class CustomersComponent implements OnInit, AfterViewInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  PRODUCT_DATA: Customer[] = [];
   // table 1
   displayedColumns: string[] = [
    'customerName', 
    'projectName', 
    //'userId', 
    'actions'
  ];
   // dataSource1 = PRODUCT_DATA;
   dataSource = new MatTableDataSource<Customer>( this.PRODUCT_DATA );
  //  dataSource: MatTableDataSource<Craft, MatPaginator> = [];

  form: FormGroup;

  constructor( 
    private apiservice: ApiService<Customer>, 
    private dialog: MatDialog,
    private fb: FormBuilder
   ) {

    this.form = this.fb.group({
      customerName: ['', Validators.required],
      projectName: ['', Validators.required],
      //userId: ['', Validators.required],
    });

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
  
  async getCustomers(){
    //const response = await this.apiService.callPostApi(url, undefined,{"postedDate": postDateToUTC}).toPromise();
    const resps = await this.apiservice.findAll('customers').toPromise();
    console.log({resps})
    // this.dataSource = new MatTableDataSource( resps );
    this.PRODUCT_DATA = [...resps]; // Ensure immutability
    this.dataSource.data = this.PRODUCT_DATA;

    // Reassign paginator and sort to reflect updates correctly
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

  }

  async createCustomer( customer: Customer ) {
    /* 
    const resps = await this.apiservice.create('crafts/create', data).toPromise();
     */
    const result = await this.apiservice.create('customers/create', customer).toPromise();
    console.log('create function', result)

    this.getCustomers();

  }
  
  async updateCustomer( customer: Customer ) {

    const { _id } = customer;
    
    // const resps = await this.apiservice.update('crafts', "67873c05d96e876ec8275c4b", data).toPromise();
    const resps = await this.apiservice.update('customers', _id!, customer).toPromise();
    
    this.getCustomers();
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
          this.createCustomer( result );
          return;
        }

        this.updateCustomer( result );
        
      } else {
        console.log('Modal closed without data');
      }
    });
  }
  
    /*Fin form y modal*/
}



@Component({
  selector: 'app-customers-modal',
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
  templateUrl: './customers-modal.component.html',
  styleUrls: ['./customers.component.scss']
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
      customerName: [this.data.form.customerName || '', Validators.required],
      projectName: [this.data.form.projectName || '', Validators.required],
      //userId: [this.data.form.userId || '', Validators.required],
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

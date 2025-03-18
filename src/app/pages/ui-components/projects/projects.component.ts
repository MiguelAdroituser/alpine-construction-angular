import { CommonModule } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { Customer } from 'src/app/interfaces/customers.interface';
import { Project } from 'src/app/interfaces/projects.interface';
import { MaterialModule } from 'src/app/material.module';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-projects',
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
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss'
})
export class ProjectsComponent {

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
    PRODUCT_DATA: Project[] = [];

    displayedColumns: string[] = [
      'projectName', 
      'registrationDate', 
      'actions'
    ];

    dataSource = new MatTableDataSource<Project>( this.PRODUCT_DATA );

    form: FormGroup;

    /* Customers config selector */
      customers: Customer[] = [];
    
      selectedCustomer: string | null = null;
    
    constructor( 
        private apiservice: ApiService<Project>, 
        private dialog: MatDialog,
        private fb: FormBuilder
       ) {
    
        this.form = this.fb.group({
          projectName: ['', Validators.required],
          registrationDate: [{ value: new Date(), disabled: true }],
          
        });
    
        // this.getProjects();
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

      async getProjects(){
          const params = new HttpParams().set('customerId', this.selectedCustomer || '');
          
          try {
      
            const projects = await this.apiservice.callGetApi<any>('projects', params).toPromise();
            console.log({ projects });
            this.PRODUCT_DATA = [...projects]; // Ensure immutability
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

      applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    
        if (this.dataSource.paginator) {
          this.dataSource.paginator.firstPage(); // Reinicia el paginador si se aplica un filtro
        }
      }

      async createProject( project: Project ) {
          /* 
          const resps = await this.apiservice.create('crafts/create', data).toPromise();
           */
          //TODO: userId
          const result = await this.apiservice.create('projects/create', {...project, customerId: this.selectedCustomer! }).toPromise();
          console.log('create function', result)
      
          this.getProjects();
      
        }

      async updateProject( project: Project ) {
      
          const { _id } = project;
          
          // const resps = await this.apiservice.update('crafts', "67873c05d96e876ec8275c4b", data).toPromise();
          const resps = await this.apiservice.update('projects', _id!, project).toPromise();
          
          this.getProjects();
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
                this.createProject( result );
                return;
              }
      
              this.updateProject( result );
              
            } else {
              console.log('Modal closed without data');
            }
          });
        }
        
          /*Fin form y modal*/

}



@Component({
  selector: 'app-projects-modal',
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
  templateUrl: './projects-modal.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ModalFormComponent implements OnInit{
  form: FormGroup;
  private bs!: Subscription | undefined;


  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ModalFormComponent>,
    private apiservice: ApiService<any>, 
    @Inject(MAT_DIALOG_DATA) public data: any // Inject the data passed to the modal
  ) {
    // Initialize the form with the passed data (element)
    this.form = this.fb.group({
      _id: [this.data.form._id || ''],
      projectName: [this.data.form.customerName || '', Validators.required],
      registrationDate: [{ value: this.getLocalDate(), disabled: true }],
      
    });

  }
  ngOnInit(): void {
    // throw new Error('Method not implemented.');
    
  }

  ngOnDestroy(): void {
    // Desuscribirse de todas las suscripciones para evitar pérdidas de memoria.
    this.bs?.unsubscribe();
  }

  getLocalDate() {
    const date = new Date();
    // Ajusta la hora a las 00:00 del día actual (puedes personalizar si lo deseas)
    date.setHours(0, 0, 0, 0); 
    return date;
  }

  onSubmit() {
    if (this.form.valid) {
      const formData = {
        ...this.form.value,
        registrationDate: this.data.form.registrationDate || this.getLocalDate() // Si ya existe, usa esa; si no, genera una nueva
      };
      this.dialogRef.close(formData);
    }
  }

  onClose() {
    this.dialogRef.close(); // Cierra el modal sin enviar datos
  }
}
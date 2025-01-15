import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MaterialModule } from 'src/app/material.module';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { ApiService } from 'src/app/services/api.service';
import { Craft } from 'src/app/interfaces/crafts.interface';

export interface productsData {
  id: number;
  imagePath: string;
  uname: string;
  budget: number;
  priority: string;
}

const PRODUCT_DATA: productsData[] = [
  {
    id: 1,
    imagePath: 'assets/images/products/dash-prd-1.jpg',
    uname: 'iPhone 13 pro max-Pacific Blue-128GB storage',
    budget: 180,
    priority: 'confirmed',
  },
  {
    id: 2,
    imagePath: 'assets/images/products/dash-prd-2.jpg',
    uname: 'Apple MacBook Pro 13 inch-M1-8/256GB-space',
    budget: 90,
    priority: 'cancelled',
  },
  {
    id: 3,
    imagePath: 'assets/images/products/dash-prd-3.jpg',
    uname: 'PlayStation 5 DualSense Wireless Controller',
    budget: 120,
    priority: 'rejected',
  },
  {
    id: 4,
    imagePath: 'assets/images/products/dash-prd-4.jpg',
    uname: 'Amazon Basics Mesh, Mid-Back, Swivel Office',
    budget: 160,
    priority: 'confirmed',
  },
];


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
  ],
  templateUrl: './crafts.component.html',
  styleUrl: './crafts.component.scss'
})
export class CraftsComponent implements OnInit{

  constructor( private apiservice: ApiService<Craft> ) {}

  ngOnInit(): void {
    this.tst();
    // this.tst2();
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
  // table 1
  displayedColumns1: string[] = ['assigned', 'name', 'priority', 'budget'];
  dataSource1 = PRODUCT_DATA;
}

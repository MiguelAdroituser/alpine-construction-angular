import { Routes } from '@angular/router';

// ui
import { CraftsComponent } from './crafts/crafts.component';

//Prueba
import { AreasComponent } from './areas/areas.component';
import { CustomersComponent } from './customers/customers.component';


export const UiComponentsRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'crafts',
        component: CraftsComponent,
      },
      {
        path: 'areas',
        component: AreasComponent,
      },
      {
        path: 'customers',
        component: CustomersComponent,
      },
    ],
  },
];

import { Routes } from '@angular/router';

// ui
import { AppBadgeComponent } from './badge/badge.component';
import { AppChipsComponent } from './chips/chips.component';
import { AppListsComponent } from './lists/lists.component';
import { AppMenuComponent } from './menu/menu.component';
import { AppTooltipsComponent } from './tooltips/tooltips.component';
import { AppFormsComponent } from './forms/forms.component';
import { AppTablesComponent } from './tables/tables.component';
import { CraftsComponent } from './crafts/crafts.component';

//Prueba
import { PruebaDTModalesComponent } from './prueba-dtmodales/prueba-dtmodales.component';
import { AreasComponent } from './areas/areas.component';
import { CustomersComponent } from './customers/customers.component';


export const UiComponentsRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'badge',
        component: AppBadgeComponent,
      },
      {
        path: 'chips',
        component: AppChipsComponent,
      },
      {
        path: 'lists',
        component: AppListsComponent,
      },
      {
        path: 'menu',
        component: AppMenuComponent,
      },
      {
        path: 'tooltips',
        component: AppTooltipsComponent,
      },
      {
        path: 'forms',
        component: AppFormsComponent,
      },
      {
        path: 'tables',
        component: AppTablesComponent,
      },
      {
        path: 'crafts',
        component: CraftsComponent,
      },
      {
        path: 'prueba-dtmodales',
        component: PruebaDTModalesComponent,
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

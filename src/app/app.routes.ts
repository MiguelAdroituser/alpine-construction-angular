import { Routes } from '@angular/router';
import { BlankComponent } from './layouts/blank/blank.component';
import { FullComponent } from './layouts/full/full.component';
import { AuthGuard } from './services/auth.guard';
import { JwtGuard } from './services/jwt.guard';

export const routes: Routes = [
  {
    path: '',
    component: BlankComponent,
    children: [
      {
        path: '',
        redirectTo: '/authentication/login',
        pathMatch: 'full',
      },
      {
        path: 'authentication',
        canActivate:[JwtGuard],//SE IMPLEMENTO ESTE GUARD PARA QUE NO ENTRE EN UN PROCESO CICLICO SI SE LE IMPLEMENTA AUTHGUARD A LA RUTA
        loadChildren: () =>
          import('./pages/authentication/authentication.routes').then(
            (m) => m.AuthenticationRoutes
          ),
      },
    ],
  },
  {
    path: '',
    component: FullComponent,
    children: [
      /* {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full',
      }, */
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./pages/pages.routes').then((m) => m.PagesRoutes),
      },
      {
        path: 'ui-components',
        canActivateChild:[AuthGuard],//ESTE GUARD SIRVE PARA SABER SI SE ESTA LOGUEADO PARA ENTRAR A LA RUTA
        loadChildren: () =>
          import('./pages/ui-components/ui-components.routes').then(
            (m) => m.UiComponentsRoutes
          ),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'authentication/error',
  },
];

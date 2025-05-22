import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service'; // Asegúrate de importar y ajustar la ruta correcta

@Injectable({
  providedIn: 'root'
})
export class JwtGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isLoggedIn()) {
      // Si el usuario está logueado, redirigir a la ruta raíz (u otra ruta si es necesario)
      this.router.navigate(['/ui-components/crafts']);
      return false;
    }
    return true;
  }
}
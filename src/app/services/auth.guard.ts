import { Injectable } from '@angular/core';
import { CanActivateChild, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
// This class implements the CanActivateChild interface, which allows it to control access to child routes.
export class AuthGuard implements CanActivateChild {
  // Constructor to inject AuthService and Router services.
  constructor(private authService: AuthService, private router: Router) {}

  // This method checks if the child route can be activated.
  async canActivateChild(): Promise<boolean> {
    try {
      // Check if the user is authenticated.
      const isAuthenticated = await this.authService.isLoggedIn();
      if (isAuthenticated) {
        // If authenticated, allow access to the child route.
        return true;
      }
      // If not authenticated, redirect to the login page.
      // this.router.navigate(['/login']);
      this.router.navigate(['/authentication/login']);
      return false;
    } catch (error) {
      // Handle errors by redirecting to the login page.
      this.router.navigate(['/authentication/login']);
      return false;
    }
  }
}

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
// import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token: string | null = null;
  private isAdmin: boolean = false;
  // private apiUrl = 'https://base-api-divine-morning-3669.fly.dev/auth/login'; // Reemplaza con la URL real de tu API
  // private apiUrl = 'http://localhost:3000/auth/login'; // Reemplaza con la URL real de tu API
  private apiUrl = `${ environment.apiUrl }auth/login`; // Reemplaza con la URL real de tu API

  constructor(private http: HttpClient) { 
    // console.log('constructor authService')
  }

  login(username: string, password: string): Observable<string> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { username, password };

    return this.http.post<{ accessToken: string}>(this.apiUrl, body, { headers })
      .pipe(
        map(response => {
        //   this.isAdmin = response.isAdmin;
          this.token = response.accessToken;
          return this.token;
        })
      );
  }

  getToken(): string | null {
    return this.token;
  }

  /* isUserAdmin(): boolean {
    return this.isAdmin;
  } */
  

  logout(): void {
    this.token = null;
  }

}

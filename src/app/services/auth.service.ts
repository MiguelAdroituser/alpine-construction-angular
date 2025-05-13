import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import * as CryptoJS from 'crypto-js'; // Importa la librería CryptoJS
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

    // return this.http.post<{ accessToken: string}>(this.apiUrl, body, { headers })
    return this.http.post<any>(this.apiUrl, body, { headers })
      .pipe(
        map(response => {
        //   this.isAdmin = response.isAdmin;
          this.token = response.accessToken;
          // return this.token;
          return response;
        })
      );
  }

  getToken(): string | null {
    return this.token;
  }

  /* isUserAdmin(): boolean {
    return this.isAdmin;
  } */

  encryptUserMetadata(metadata: any): string {
    const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(metadata), this.secretKey).toString();
    return encryptedData;
  }

  decryptUserMetadata(encryptedData: string): any {
    if(encryptedData === ''){
      encryptedData = this.cookieService.get('userMetadata');
    }
    const decryptedData = CryptoJS.AES.decrypt(encryptedData, this.secretKey).toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedData);
  }

  getDecryptedToken(): string | null {
    const encryptedToken = this.cookieService.get('authToken');
    if (encryptedToken) {
      const bytes = CryptoJS.AES.decrypt(encryptedToken, this.secretKey);
      //console.log('encryptedToken',encryptedToken)
      return bytes.toString(CryptoJS.enc.Utf8);
    }
    return null;
  }
  

  logout(): void {
    this.token = null;
  }

}

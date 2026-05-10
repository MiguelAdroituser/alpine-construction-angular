import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { CookieService } from 'ngx-cookie-service';
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
  private secretKey = environment.secretKey;

  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
  ) { 
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

          //OBTENEMOS EL TOKEN
          const token = response.accessToken;

          const tokenCrm = response.accessToken
          //ENCRYPTAMOS EL TOKEN PARA GUARDARLO EN LA COOKIE
          const encryptedToken = this.encryptToken(token);
          const encryptedTokenCrm = this.encryptToken(tokenCrm)

          // Guardar el resto de los datos en otra cookie (puedes ajustar las propiedades según tus necesidades)
          const userMetadata = {
            ttl: 604800,
            isAdmin: response.isAdmin,
            userName: response.username
          };


          const currentDate = new Date();
          const futureDate = new Date(currentDate.getTime() + Number(userMetadata.ttl)*1000);

          //ENCRYPTAMOS LA METADATA DEL USUARIO
          const encryptedUserMetadata = this.encryptUserMetadata(userMetadata);
          this.cookieService.set('userMetadata', encryptedUserMetadata, { path: '/', expires: futureDate });
          // Guardar el token en la cookie existente
          this.cookieService.set('authToken', encryptedToken, { path: '/', expires: futureDate });
          this.cookieService.set('authTokenCrm', encryptedTokenCrm, { path: '/', expires: futureDate });

          // return this.token;
          return response;
        })
      );
  }

  encryptToken(token: string): string {
    return CryptoJS.AES.encrypt(token, this.secretKey).toString();
  }

  getToken(): string | null {
    return this.token;
  }

  isLoggedIn(): boolean {
    const decryptedToken = this.getDecryptedToken();
    return decryptedToken !== null && decryptedToken !== undefined && decryptedToken !== '';
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
  

  async logout(): Promise<void> {
    this.token = null;

    // Elimina las cookies relacionadas con la autenticación
    this.cookieService.delete('authToken', '/');
    this.cookieService.delete('userMetadata', '/');
    this.cookieService.delete('authTokenCrm', '/');

    // this.cookieService.delete('branch', '/');

    // Verifica que las cookies han sido eliminadas
    const authToken = this.cookieService.get('authToken');
    const userMetadata = this.cookieService.get('userMetadata');
    const authTokenCrm = this.cookieService.get('authTokenCrm');
    // const branch = this.cookieService.get('branch');

    // if (authToken || userMetadata || authTokenCrm || branch) {
    if (authToken || userMetadata || authTokenCrm) { //|| branch
        return Promise.reject(new Error('Failed to delete cookies'));
    }

    // Puedes realizar cualquier otra limpieza necesaria, como redirigir al usuario, etc.
    return Promise.resolve(); // Se completa inmediatamente, ya que las operaciones anteriores son sincrónicas
  }

}

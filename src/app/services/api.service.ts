// branch.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
// import { IDataService } from 'src/app/shared/components/ao-grid/types/types';
// import { DateIncidents } from '../models/activity.model';
// import { QueryFilter } from '../interfaces/queryfilter.interface';

@Injectable({
    providedIn: 'root',
})
export class ApiService<T>{
    private readonly apiUrl = environment.apiUrl; // Ajusta esta URL a la de tu backend

    constructor(private http: HttpClient) { }

    create(controller:string,dto: T): Observable<T> {
        return this.http.post<T>(`${this.apiUrl}${controller}`, dto);
    }

    update(controller:string,id: string, dto: T): Observable<T> {
        return this.http.patch<T>(`${this.apiUrl}${controller}/${id}`, dto);
    }

    findOne(controller:string,id: string): Observable<T> {
        return this.http.get<T>(`${this.apiUrl}${controller}/${id}`);
    }
    delete(controller:string,id: string): Observable<any> {
        return this.http.delete<T>(`${this.apiUrl}${controller}/${id}`);
    }
   
    findAll(controller: string): Observable<any> {
        return this.http.get<T[]>(`${this.apiUrl}${controller}`);
    }
    callPostApi(url:string,params?:HttpParams,data?:any):Observable<any>{
        return this.http.post<T[]>(`${this.apiUrl}${url}?${params}`,data);
    }
    callGetApi(url:string,params?:HttpParams):Observable<any>{
        return this.http.get<T[]>(`${this.apiUrl}${url}?${params}`);
    }
}

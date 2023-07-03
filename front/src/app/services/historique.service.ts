import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


interface historique{
   user: string,
   date: string,
   nelat: number;
   nelng: number;
   swlat: number;
   swlng: number;
   espece: string,
   nb_observation: number,
   id:number
}


@Injectable({
   providedIn: 'root'
})

export class HistoriqueService {
   private baseUrl = 'http://localhost:5000/api/historique';

   constructor(private http: HttpClient) { }
 
   getHistorique() {
     return this.http.get(`${this.baseUrl}`);
   }
 
   addHistorique(data: historique) {
     return this.http.post(`${this.baseUrl}`, data);
   }
 
   updateHistorique(id: number, data: historique) {
     return this.http.put(`${this.baseUrl}/${id}`, data);
   }
 
   deleteHistorique(id: number) {
     return this.http.delete(`${this.baseUrl}/${id}`);
   }

}

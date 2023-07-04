import { Injectable } from '@angular/core';
import { MapComponent } from '../map/map.component';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

interface historique {
   user: string,
   date: string,
   nelat: number;
   nelng: number;
   swlat: number;
   swlng: number;
   espece: string,
   nb_observation: number,
   id: number,
}

@Injectable({
   providedIn: 'root'
})
export class MapService {
   private mapComponent!: MapComponent

   constructor(private http: HttpClient ) { }

   setMapComponent(mapComponent: MapComponent,) {
      this.mapComponent = mapComponent;
   }

   requestINAT(selectedItem: string): Observable<any> {

      const apiUrl = 'https://api.inaturalist.org/v1/observations';
      const searchTerm = selectedItem;
      const placeId = 1;
      const perPage = 200;
      let page = 1;
      const orderBy = 'observed_on';
      const order = 'desc';
      const coor = this.mapComponent.getVisibleBound();
      const coorNE = coor._northEast
      const coorSW = coor._southWest;
      const nelat = coorNE.lat;
      const nelng = coorNE.lng;
      const swlat = coorSW.lat;
      const swlng = coorSW.lng;

      console.log("params", searchTerm, nelat);

      const historique: historique = {
         user: "admin",
         date: "date",
         nelat: nelat,
         nelng: nelng,
         swlat: swlat,
         swlng: swlng,
         espece: searchTerm,
         nb_observation: 0,
         id: 0,
      }

      return this.http
         .get(`${apiUrl}?swlat=${swlat}&swlng=${swlng}&nelat=${nelat}&nelng=${nelng}&q=${searchTerm}&per_page=${perPage}&page=${page}&order_by=${orderBy}&order=${order}`)
         .pipe(
            map((results: any) => {
            this.mapComponent.traitementData(results, historique)
            return results;
         })
      );
   }
}